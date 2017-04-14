import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vector } from 'app/animation/vector';
import { ProjectNode } from 'app/animation/project_node';

@Component({
  selector: 'project-list',
  templateUrl: './project_explore.component.html',
  styleUrls: ['./project_explore.component.css']
})

export class ProjectExploreComponent {

  @ViewChild('canvasEl') canvasEl;

  AMBIENCE_RANDOM_ACTION_INTERVAL: number = 3000;
  AMBIENCE_WAIT_AFTER_USER_INPUT: number = 7000;
  LAME_NODE_COUNT: number = 105;
  canvas;
  canvas_width: number = this.config_service.MOBILE_WIDTH;
  canvas_height: number = this.config_service.MOBILE_WIDTH;
  done: boolean = false;
  context: CanvasRenderingContext2D;
  timer = window.requestAnimationFrame;

  frameCount: number = 0;
  nodes: Array<any> = [];
  activeNode;
  hoveredNode;
  nextActionTime;
  formVisible;
  mousePos;
  globalMousePos;
  hovered: boolean = false;
  pauseInteraction: boolean = false;
  selected_project: any = {};
  selected_project_changed: boolean = false;
  hovered_project: any = {};

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    @Inject('utils_service') private utils_service,
    @Inject('config_service') private config_service,
    @Inject('deeplink_service') private deeplink_service,
    @Inject('projects_service') private projects_service,
    @Inject('languages_service') private languages_service
  ) {
    this.deeplink_service.query = null;
    this.projects_service.view = 'explore';
    this.projects_service.requestParams.page_size =
      this.config_service.EXPLORE_PAGE_SIZE;
    this.projects_service.requestParams.order_by = 'random';
    this.projects_service.requestParams.page_token = '';
  };

  ngOnInit() {
    if (window.innerWidth < this.config_service.MOBILE_WIDTH) {
      this.projects_service.requestParams.page_size =
        this.config_service.LIST_PAGE_SIZE;
      this.router.navigate(['/list', 'production']);
    } else {
      window.addEventListener('resize', () => {
        if (window.innerWidth < this.config_service.MOBILE_WIDTH &&
          this.router.url.indexOf('explore') > 0) {
          this.projects_service.requestParams.page_size =
            this.config_service.LIST_PAGE_SIZE;
          this.router.navigate(['/list', 'production']);
        }
      });
    }

    const dpi = window.devicePixelRatio || 1;
    this.canvas = this.canvasEl.nativeElement;

    // Size the canvas based on device dpi
    this.canvas.width = this.canvas_width * dpi;
    this.canvas.height = this.canvas_height * dpi;

    // Set 2d rendering context
    this.context = this.canvas.getContext('2d');
    this.context.scale(dpi, dpi);

    this.done = false;

    // Reset language filters
    this.languages_service.selectedLanguages = [];

    // Listen for projects to come back from API
    this.projects_service.projectsUpdate$.subscribe(item => {
      this.selectNone();
      this.loadProjects();
      this.canvas.dispatchEvent(new Event('mousemove'));
      this.doRandomAction();
    });

    return this.timer(this.update);
  }

  ngOnDestroy() {
    this.done = true;
  }

  private loadProjects = () => {
    const projects: any = this.projects_service.projects.slice();
    const lame_node: Object = { lame: true };
    const _that = this;
    _that.nodes = [];
    let lame_index = 0;

    while (lame_index < this.LAME_NODE_COUNT) {
      projects.push(lame_node);
      lame_index++;
    }

    projects.forEach((function (project, index) {
      if (index > 15 && !project.lame) {
        project.small = true;
      }
      _that.nodes.push(new ProjectNode(project));
    }));
  }

  private clickHandler = (evt) => {
    const box = this.canvas.getBoundingClientRect();
    const coords = {
      x: evt.pageX - box.left - window.pageXOffset,
      y: evt.pageY - box.top - window.pageYOffset
    };
    const clicked_node = this.getNodeUnder(
      coords.x - this.canvas_width / 2,
      coords.y - this.canvas_height / 2
    );
    if (clicked_node) {
      if (clicked_node.active) {
        clicked_node.onClick();
      } else {
        this.selectNone();
        clicked_node.onClick();
        this.selectProject(clicked_node);
      }
      this.config_service.TRACK_EVENT(
        'Projects_Explore', 'Click', 'Bubble ' + clicked_node.data.name);
    } else {
      this.selectNone();
    }
    this.userActionOccurred();
  }

  private selectProject = (node) => {
    this.selected_project = node.data;
    setTimeout(() => {
      this.selected_project_changed = true;
    }, 200);
  }

  private moveHandler = (evt) => {
    this.hoveredNode = this.mousePos ?
      this.getNodeUnder(this.mousePos.x, this.mousePos.y) : null;

    const box = this.canvas.getBoundingClientRect();
    this.globalMousePos = {
      x: evt.pageX - box.left - window.pageXOffset,
      y: evt.pageY - box.top - window.pageYOffset
    };
    this.mousePos = new Vector(
      this.globalMousePos.x - this.canvas_width / 2,
      this.globalMousePos.y - this.canvas_height / 2,
      0
    );
    evt.preventDefault();
    evt.stopPropagation();
  }

  private hoverHandler = () => {
    if (!this.mousePos) {
      return;
    }
    const new_hovered_node =
      this.getNodeUnder(this.mousePos.x, this.mousePos.y);
    this.clearHoverStyles();

    if (this.hoveredNode && new_hovered_node) {
      this.setHoverStyles(new_hovered_node);
    }

    if (!this.hovered && this.hoveredNode && this.hoveredNode.data.small) {
      this.hoveredNode.fadeCount = 0;
    }
  }

  private setHoverStyles = (new_hovered_node) => {
    this.canvas.style.cursor = 'pointer';
    this.hovered_project = new_hovered_node;

    if (new_hovered_node.data.name != this.hoveredNode.data.name
      && this.hoveredNode.small) {
      new_hovered_node.data.focus = true;
      new_hovered_node.fadeCount = 0;
      this.hoveredNode.data.focus = false;
    } else {
      new_hovered_node.data.focus = false;
      this.hoveredNode.data.focus = true;
    }
    this.hovered = true;
  }

  private clearHoverStyles = () => {
    this.canvas.style.cursor = 'default';
    this.nodes.forEach((node) => {
      node.data.focus = false;
    });
    this.hovered = false;
  }

  private update = () => {
    if (this.done) {
      return;
    }

    this.render(this.context);
    this.hoverHandler();

    if (this.nodes.length) {
      this.frameCount += 1;
    }

    if (this.frameCount == 1) {
      this.ambientActionOccurred();
    }

    this.createLinks();

    this.nodes.forEach((node) => {
      node.updateMousePos(this.mousePos);
      node.update();
    })

    this.updateAmbience();

    return this.timer(this.update);
  }

  private createLinks = () => {
    for (var n of this.nodes) {
      if (n.link != null) {
        continue;
      }
      // # continue if Math.random() > 0.9
      n.linkTo(this.nodes[Math.floor(Math.random() * this.nodes.length)]);
    }
  }

  private render = (ctx) => {
    ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
    ctx.save();
    ctx.translate(this.canvas_width / 2, this.canvas_height / 2);

    // Lines on bottom
    // FF Can't deal with stroked shapes
    if (this.utils_service.getBrowserVendor() !== 'Firefox') {
      this.nodes.forEach((node, index) => {
        node.renderLink(ctx);
      });
    }

    // Lame (gray non-interactive) nodes next
    this.nodes.forEach((node, index) => {
      if (node.data.lame && !node.active) {
        node.render(ctx);
      }
    });

    // Then small colored project nodes
    this.nodes.forEach((node, index) => {
      if (!node.data.lame && !node.active && node.data.small) {
        node.render(ctx);
      }
    });

    // Then large colored project nodes with logo
    this.nodes.forEach((node, index) => {
      if (!node.data.lame &&
        !node.active &&
        !node.data.small &&
        !node.data.focus) {
        node.render(ctx);
      }
    });

    // Hovered next
    this.nodes.forEach((node, index) => {
      if (!node.data.lame && !node.active && node.data.focus) {
        node.render(ctx);
      }
    });

    // Selected node on top
    this.nodes.forEach((node, index) => {
      if (!node.data.lame && node.active) {
        node.render(ctx);
      }
    });

    ctx.restore();
  }

  // Interaction Stuff
  private setNextActionDelay = (offset) => {
    this.nextActionTime = new Date(new Date().getTime() + offset);
  }

  private userActionOccurred = () => {
    this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
    this.activeNode = this.getActiveNodes()[0];
  }

  private ambientActionOccurred = () => {
    this.activeNode = this.getActiveNodes()[0];
  }

  private timeUntilNextAction = () => {
    return this.nextActionTime - new Date().getTime();
  }

  private updateAmbience = () => {
    if (this.timeUntilNextAction() < 0) {
      this.doRandomAction();
      return this.ambientActionOccurred();
    }
  }

  private getActiveNodes = () => {
    return this.nodes.filter(function (n) {
      return n.active;
    });
  }

  private doRandomAction = () => {
    let node;
    const filteredNodes = this.filterLames();

    if (this.pauseInteraction) {
      return;
    }

    if (this.getActiveNodes().length) {
      this.setNextActionDelay(this.AMBIENCE_RANDOM_ACTION_INTERVAL);
      return this.selectNone();
    } else {

      node = filteredNodes[Math.floor(Math.random() * filteredNodes.length)];
      if (node != null) {
        this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
        node.activate();
        this.selectProject(node);
      }
    }
  }

  private filterLames = () => {
    return this.nodes.filter(
      node => !node.data.lame
    );
  }

  private selectNone = () => {
    this.selected_project = {};
    this.selected_project_changed = false;

    for (var n of this.nodes) {
      n.deactivate();
    }

  }

  private getNodeUnder = (x, y) => {
    let nodes = [];
    let chosen = null;

    for (var i = this.nodes.length - 1; i >= 0; i += -1) {
      var n = this.nodes[i];
      if (n.hitTest(x, y) && !n.data.lame) {
        nodes.push(n);
      }
    }
    nodes.forEach((node) => {
      if (!node.data.small) {
        chosen = node;
      }
    });
    return (nodes.length && !chosen) ? nodes[0] : chosen;
  }

  private loadProjectDetails = function (evt) {
    this.projects_service.cachedColor =
      this.selected_project.fallbackColor || this.selected_project.primaryColor;

    this.router.navigate(['/', this.selected_project.id]);

    this.config_service.TRACK_EVENT(
      'Projects_Explore', 'Click', 'View ' + this.selected_project.name);
    evt.preventDefault();
    evt.stopPropogation;
  }

  private clickedArrow = function (direction, $event) {
    let currentIndex = 0;
    let newIndex;
    let chosen;
    const filteredNodes = this.filterLames();

    filteredNodes.forEach((node, index) => {
      if (node.active) {
        currentIndex = index;
      }
    });

    newIndex = this.utils_service.modulo(
      currentIndex + direction, filteredNodes.length);
    this.selectNone();
    chosen = filteredNodes[newIndex];
    chosen.activate();
    this.selectProject(chosen);
    this.userActionOccurred();

    this.config_service.TRACK_EVENT(
      'Projects_Explore', 'Click', 'Cycle ' + direction);

    $event.stopPropagation();
  };

}

