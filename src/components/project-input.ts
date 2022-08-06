import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';
import * as validation from '../util/validation';
import { Component } from './base-component';

	export class ProjectInput extends Component<
		HTMLDivElement,
		HTMLFormElement
	> {
		titleInputElement: HTMLInputElement;
		descriptionInputElement: HTMLInputElement;
		peopleInputElement: HTMLInputElement;

		constructor() {
			super("project-input", "app", true, "user-input");
			this.titleInputElement = this.element.querySelector(
				"#title"
			) as HTMLInputElement;
			this.descriptionInputElement = this.element.querySelector(
				"#description"
			) as HTMLInputElement;
			this.peopleInputElement = this.element.querySelector(
				"#people"
			) as HTMLInputElement;
			this.configure();
		}

		configure() {
			this.element.addEventListener("submit", this.submitHandler);
		}

		renderContent(): void {}

		private clearInputs() {
			this.titleInputElement.value = "";
			this.descriptionInputElement.value = "";
			this.peopleInputElement.value = "";
		}

		private gatherUserInput(): [string, string, number] | void {
			const enteredTitle = this.titleInputElement.value;
			const enteredDescription = this.descriptionInputElement.value;
			const enteredPeople = this.peopleInputElement.value;

			const titleValidation: validation.Validatable = {
				value: enteredTitle,
				required: true,
			};
			const descValidation: validation.Validatable = {
				value: enteredDescription,
				required: true,
				minLength: 5,
			};
			const peopleValidation: validation.Validatable = {
				value: +enteredPeople,
				required: true,
				min: 1,
				max: 5,
			};

			if (
				!validation.validate(titleValidation) ||
				!validation.validate(descValidation) ||
				!validation.validate(peopleValidation)
			) {
				alert("Invalid input, please try again");
				return;
			} else {
				return [enteredTitle, enteredDescription, +enteredPeople];
			}
		}

		@autobind
		private submitHandler(event: Event) {
			event.preventDefault();
			const userInput = this.gatherUserInput();
			if (Array.isArray(userInput)) {
				const [title, desc, people] = userInput;
				projectState.addProject(title, desc, people);
				this.clearInputs();
			}
		}
	}