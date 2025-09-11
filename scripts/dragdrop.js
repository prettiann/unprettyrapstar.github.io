// dragdrop.js

function createDragStartListener(tempRank) {
  return function (event) {
    event.dataTransfer.setData("text/plain", String(tempRank));
  };
}

function createDropListener() {
  return function (event) {
    event.preventDefault();
    const elem = event.target;

    const draggedTraineeIndex = parseInt(
      event.dataTransfer.getData("text/plain"),
      10
    );
    const droppedTraineeIndex = parseInt(
      elem.getAttribute("data-rankid"),
      10
    );

    if (!Number.isNaN(draggedTraineeIndex) && !Number.isNaN(droppedTraineeIndex)) {
      swapTrainees(draggedTraineeIndex, droppedTraineeIndex);
    }
  };
}