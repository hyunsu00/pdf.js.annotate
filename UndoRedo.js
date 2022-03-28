/*
	JS-Undo-Redo

	Verion: 0.5
	Date: 2015-02-06

	Author: Laszlo Szenes
	License: MIT

	Implementing an undo-redo functionality to save and restore states based on data
	stored in an object, utilizing HTML5 Localstorage

	LS = abbreviation for Localstorage
*/

// paramaters:
// stacksize: 얼마나 많은 단계를 되돌릴 수 있는지
// workObj: 저장/복원될 객체 - 반복을 피하기 위해 여기에 한 번 주어진
export function undoRedo(stackSize,workObj) {
	var stackSize=stackSize || 10;  //default is 10

	// 이것은 스택의 작업 복사본입니다.
	// 변경될 때마다 localStorage에 저장됩니다.
	var stUndo=[]; // 스택 실행 취소
	var stRedo=[]; // 스택 다시 실행
	var lastSav;	 // 마지막으로 저장된 상태

	var L=localStorage; // localStorage의 약어

	// 스택에 새 값 추가
	function save() {
		var mod={l:1}; // LS에 동기화해야 하는 변수를 추적하기 위해
		var w=JSON.stringify(workObj);

		if(lastSav && JSON.stringify(lastSav)==w) return; // 아무것도 바뀌지 않았어, 아무것도 저장하지 않았어

		if(lastSav) {
			stUndo.push(lastSav);
			if(stUndo.length>stackSize) stUndo.shift(); // 너무 많은 상태가 저장된 경우 가장 오래된 것 제거
			mod.u=1
		};
		if(stRedo.length>0) {stRedo.length=0;mod.r=1}; // 새 상태를 저장하면 다시 실행 스택이 무효화됩니다.
		lastSav=JSON.parse(w); // 객체 복제
		syncLS(mod);
	}

	// 마지막으로 저장한 상태로 복원
	function undo() {
		save();  // 마지막 순간의 변경 사항이 저장되었는지 확인하십시오.
		if(stUndo.length>0) {
			stRedo.push(lastSav);
			lastSav=stUndo.pop();
			extend(workObj,lastSav);
			syncLS();  // 모두 동기화
		}
	}

	// 다시 실행
	function redo() {
		save(); // 마지막 순간의 변경 사항이 저장되었는지 확인하십시오.
		if(stRedo.length>0) {
			stUndo.push(lastSav);
			lastSav=stRedo.pop();
			extend(workObj,lastSav);
			syncLS();  // 모두 동기화
		}		
	}

	// 실행 취소/다시 실행 스택 지우기
	function clear() {
		localStorage.clear();
		lastSav=false;
		stUndo.length=0;
		stRedo.length=0;
	}

	// 마지막 세션에서 남겨진 것이 있는지 확인하십시오.
	// 이전에 저장한 항목이 있는 경우 레코드 복원
	if(L.lastSav) {
		lastSav=JSON.parse(L.lastSav);
		extend(workObj,lastSav);  // 마지막으로 저장된 상태 복원
		if(L.stUndo) stUndo=JSON.parse(L.stUndo);  // 실행 취소 스택 복원
		if(L.stRedo) stRedo=JSON.parse(L.stRedo);  // 리두 스택 복원
	}

	// =========helper functions
	// 감소하는 배열 복원을 수용하기 위해 대상의 배열을 삭제하는 특수 `extend` 함수
	function extend (target, source) {
	  target = target || {};
	  if(target.length+"" != "undefined"){ // 배열이라면
		while(target.length > 0) {  // 배열을 비운다
    		target.pop();
		}
	  }
	  for (var prop in source) {  // 재귀적으로 객체의 깊은 복사를 수행
	    if (typeof source[prop] === 'object') {
	      target[prop] = extend(target[prop], source[prop]);
	    } else {
	      target[prop] = source[prop];
	    }
	  }
	  return target;
	}	

	// LocalStorage에 동기화(저장)
	function syncLS(what){
		what= what || {u:1,l:1,r:1};  // U=undo, L=lastSav, R=redo
		if(what.u) L.stUndo=JSON.stringify(stUndo);
		if(what.r) L.stRedo=JSON.stringify(stRedo);
		if(what.l) L.lastSav=JSON.stringify(lastSav);
	}


	return {  // API 기능 노출
		save: save,
		undo: undo,
		redo: redo,
		clear: clear,
		hasUndo: function(){return stUndo.length>0},
		hasRedo: function(){return stRedo.length>0},
	}
}