// const electron = window.require('electron');
// const { exec } = electron.remote.require('child_process');
//
// export function execJuliaScript (path) {
//   const promise = new Promise((resolve, reject) => {
//     exec(`julia ./../${path}`, (err, stdout, stderr) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//
//       const result = JSON.parse(stdout);
//       resolve(result);
//     });
//   });
//
//   return promise;
// }

export function convertJuliaChartArrInJsArr(u, index) {
    const resultArr = [];
    for (let i = 0; i < u.length; i++) {
        resultArr.push(u[i][index]);
    }
    return resultArr;
}
