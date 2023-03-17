import * as fs from "fs";
import { parse } from 'csv-parse';

export const parseCSVMatrix = (filePath: string): Promise<number[][]> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    parse(fileContent, {
      delimiter: ',',
    }, (error, result: string[][]) => {
      if (error) {
        reject(error);
      }

      resolve(result.map((row) => row.map((cell) => parseInt(cell, 10))));
    });
  });
};
export const parseCSVNodeList = (filePath: string): Promise<Array<{ id: number, startDate: string, endDate: string }>> => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    parse(fileContent, {
      delimiter: ',',
    }, (error, result: string[][]) => {
      if (error) {
        reject(error);
      }

      resolve(result.map((row) =>

        {
          let id=undefined;
          let startDate="";
          let endDate="";
          if(row.length===3){
            id = parseInt(row[0], 10);
            startDate = row[1];
            endDate = row[2];
          }

          const returnObject = {id:id,startDate:startDate,endDate:endDate};


          return returnObject;

        }


      ));
    });
  });
};
