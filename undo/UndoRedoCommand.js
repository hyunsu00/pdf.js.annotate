export class UndoRedoCommand {
	constructor(element, undoValue, redoValue) {
		this._element = element;
		this._undoValue = undoValue;
		this._redoValue = redoValue;
	}
	Undo() {
		throw new Error(this.constructor.name + '클래스는 Undo() 를 구현해 주어야 한다.');
	}
	Redo() {
		throw new Error(this.constructor.name + '클래스는 Redo() 를 구현해 주어야 한다.');
	}
}

export class AppendChildCommand extends UndoRedoCommand {

	constructor(element, undoValue, redoValue) {
		super(element, undoValue, redoValue);
		this._parentNode = element.parentNode;
	}

	Undo () {
		let id = this._element.getAttribute('data-pdf-annotate-id');
		let uuid = this._element.getAttribute('data-pdf-annotate-uuid');
		let type = this._element.getAttribute('data-pdf-annotate-type');
		this._parentNode.removeChild(this._element);
	}

	Redo() {
		let id = this._element.getAttribute('data-pdf-annotate-id');
		let uuid = this._element.getAttribute('data-pdf-annotate-id');
		let type = this._element.getAttribute('data-pdf-annotate-type');
		this._parentNode.appendChild(this._element);
	}
}

export class ModifyChildCommand extends UndoRedoCommand {

	Undo () {
		for (let key in this._undoValue) {
			this._element.setAttribute(key, this._undoValue[key]);
		}
	}

	Redo() {
		for (let key in this._redoValue) {
			this._element.setAttribute(key, this._redoValue[key]);
		}
	}
}