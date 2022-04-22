export default class UndoRedoManager {

	_undoStack = [];
	_redoStack = [];

	Add(command) {
		this._undoStack.push(command);
		if (this._redoStack.length > 0) {
			this._redoStack = [];
		}
	}

	Undo() {
		if (this._undoStack.length <= 0) {
			return;
		}

		let command = this._undoStack.pop();
		this._redoStack.push(command);
		command.Undo();
	}

	Redo() {
		if (this._redoStack.length <= 0) {
			return;
		}

		let command = this._redoStack.pop();
		this._undoStack.push(command);
		command.Redo();
	}

	IsUndo() {
		return this._undoStack.length ? true : false;
	}

	IsRedo() {
		return this._redoStack.length ? true : false;
	}
}
