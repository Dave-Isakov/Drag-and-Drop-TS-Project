import { autobind } from '../decorators/autobind';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { Component } from './base-component';
import { ProjectItem } from './project-item';

	export class ProjectList
		extends Component<HTMLDivElement, HTMLElement>
		implements DragTarget
	{
		assignedProjects: Project[] = [];

		constructor(private type: "active" | "finished") {
			super("project-list", "app", false, `${type}-projects`);
			this.configure();
			this.renderContent();
		}

		@autobind
		dragOverHandler(event: DragEvent): void {
			if (
				event.dataTransfer &&
				event.dataTransfer.types[0] === "text/plain"
			) {
				event.preventDefault();
				const listEl = this.element.querySelector("ul")!;
				listEl.classList.add("droppable");
			}
		}

		@autobind
		dropHandler(event: DragEvent): void {
			const projectId = event.dataTransfer!.getData("text/plain");
			projectState.moveProject(
				projectId,
				this.type === "active"
					? ProjectStatus.Active
					: ProjectStatus.Finished
			);
		}

		@autobind
		dragLeaveHandler(event: DragEvent): void {
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.remove("droppable");
		}

		private renderProjects() {
			const listEl = document.getElementById(
				`${this.type}-projects-list`
			)!;
			listEl.innerHTML = "";
			for (const prjItem of this.assignedProjects) {
				new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
			}
		}

		configure(): void {
			this.element.addEventListener("dragover", this.dragOverHandler);
			this.element.addEventListener("dragleave", this.dragLeaveHandler);
			this.element.addEventListener("drop", this.dropHandler);
			projectState.addListener((projects: Project[]) => {
				const relevantProject = projects.filter((prj) => {
					if (this.type === "active") {
						return prj.status === ProjectStatus.Active;
					}
					return prj.status === ProjectStatus.Finished;
				});
				this.assignedProjects = relevantProject;
				this.renderProjects();
			});
		}

		renderContent() {
			const listID = `${this.type}-projects-list`;
			this.element.querySelector("ul")!.id = listID;
			this.element.querySelector("h2")!.textContent =
				this.type.toUpperCase() + " PROJECTS";
		}
	}