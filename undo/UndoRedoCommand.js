export class UndoRedoCommand {
	constructor(docID, target, value) {
		this._docID = docID;
		this._target = target;
		this._value = value;
	}
	Undo() {
		throw new Error(this.constructor.name + '클래스는 Undo() 를 구현해 주어야 한다.');
	}
	Redo() {
		throw new Error(this.constructor.name + '클래스는 Redo() 를 구현해 주어야 한다.');
	}

	GetID() {
		return this._target.getAttribute('data-pdf-annotate-id');
	}
	GetUUID() {
		return this._target.getAttribute('data-pdf-annotate-uuid');
	}
	GetType() {
		this._target.getAttribute('data-pdf-annotate-type');
	}

	_GetAnnotations() {
		return JSON.parse(localStorage.getItem(`${this._docID}/annotations`)) || [];
	}
	_UpdateAnnotations(annotations) {
		localStorage.setItem(`${this._docID}/annotations`, JSON.stringify(annotations));
	}
	_FindAnnotation() {
		let index = -1;
		let annotations = this._GetAnnotations();
		let annotationId = this.GetUUID();
		for (let i = 0, l = annotations.length; i < l; i++) {
			if (annotations[i].uuid === annotationId) {
				index = i;
				break;
			}
		}
		return index;
	}
}

export class AppendChildCommand extends UndoRedoCommand {

	constructor(docID, target, value) {
		super(docID, target, value);
		this._parentNode = target.parentNode;
	}

	Undo () {
		// element 업데이트
		this._parentNode.removeChild(this._target);

		// localStorage 업데이트
		let index = this._FindAnnotation();
		if (index > -1) {
			let annotations = this._GetAnnotations();
			annotations.splice(index, 1);
			this._UpdateAnnotations(annotations);
		}
	}

	Redo() {
		// element 업데이트
		this._parentNode.appendChild(this._target);

		// localStorage 업데이트
		let annotations = this._GetAnnotations();
		annotations.push(JSON.parse(this._value.redo.str));
		this._UpdateAnnotations(annotations);
	}
}

export class ModifyChildCommand extends UndoRedoCommand {

	Undo () {
		// element 업데이트
		let undoValue = this._value.undo.value;
		for (let key in undoValue) {
			this._target.setAttribute(key, undoValue[key]);
		}

		// localStorage 업데이트
		let index = this._FindAnnotation();
		if (index > -1) {
			let annotations = this._GetAnnotations();
			annotations[index] = JSON.parse(this._value.undo.str);
			this._UpdateAnnotations(annotations);
		}
	}

	Redo() {
		// element 업데이트
		let redoValue = this._value.redo.value;
		for (let key in redoValue) {
			this._target.setAttribute(key, redoValue[key]);
		}

		// localStorage 업데이트
		let index = this._FindAnnotation();
		if (index > -1) {
			let annotations = this._GetAnnotations();
			annotations[index] = JSON.parse(this._value.redo.str);
			this._UpdateAnnotations(annotations);
		}
	}
}