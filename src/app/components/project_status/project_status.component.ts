import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'project-status',
    templateUrl: './project_status.component.html',
    styleUrls:['./project_status.component.css']
})
export class ProjectStatusComponent implements OnInit {
    @Input() Schedule: String = "Gray"
    @Input() Cost: String = "Gray"
    @Input() Scope: String = "Gray"
    @Input() Resource: String = "Gray"
    constructor() { }

    ngOnInit() { }
}