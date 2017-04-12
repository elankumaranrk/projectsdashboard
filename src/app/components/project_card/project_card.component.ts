import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'project-card',
  templateUrl: './project_card.component.html',
  styleUrls: ['./project_card.component.css']
})
export class ProjectCardComponent {
  @Input() project: any;

  randomClass: string;
  color: string = '';
  hoverColor: string = '#dedede';
  hovered: boolean = false;

  constructor(
    private router:Router,
    @Inject('config_service') private config_service,
    @Inject('projects_service') private projects_service,
    @Inject('utils_service') private utils_service
  ) {
    // For percieved variation of node-background graphics
    const classes = [ 'one', 'two', 'three' ];
    this.randomClass = classes[Math.floor(Math.random()*classes.length)];
  }

  ngOnInit() {
    let hex_color =
      this.project.primaryColor ?
      this.project.primaryColor :
      this.project.fallbackColor;

    const rgb = this.utils_service.hexToRgb(hex_color);

    this.color = 'rgba('+ rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + '.9' +')';
  }

  private hoverCard($event) {
    this.hovered = !this.hovered;
    this.hoverColor = this.hovered ? this.color : '#dedede';
  }

  private loadProjectDetails(evt, project) {
    this.projects_service.cachedColor =
      project.fallbackColor || project.primaryColor;

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Click', 'View ' + project.name);

    evt.preventDefault();
  }

}

