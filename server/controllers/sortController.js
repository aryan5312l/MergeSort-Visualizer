exports.performMergeSort = (array) => {
  const steps = [];
  
  function mergeSort(arr, start = 0, end = arr.length - 1) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      steps.push({ type: 'split', range: [start, mid, end] });
      mergeSort(arr, start, mid);
      mergeSort(arr, mid + 1, end);
      merge(arr, start, mid, end);
    }
  }

  function merge(arr, start, mid, end) {
    // ... merge logic with step recording
    steps.push({ type: 'merge', range: [start, end] });
  }

  mergeSort([...array]);
  return steps;
};