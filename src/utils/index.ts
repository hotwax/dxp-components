import { toastController } from '@ionic/vue';
import Papa from 'papaparse'

// TODO Use separate files for specific utilities

// TODO Remove it when HC APIs are fully REST compliant
const hasError = (response: any) => {
  return !!response.data._ERROR_MESSAGE_ || !!response.data._ERROR_MESSAGE_LIST_;
}

const showToast = async (message: string) => {
  const toast = await toastController
    .create({
      message,
      duration: 3000,
      position: 'top',
    })
  return toast.present();
}



// Utility for parsing CSV file 
// Package Used : PapaParse (Link to Documentation : https://www.papaparse.com/docs#config)

// In this we will be recieving the file and options in the function 
// and we returning a promise with results in it 

// We have used the parse method of the Papa utility which will take a config object with File.
// In the config object we have passed various keys:
//   - header : It tells Papaparse that there will be a header in the CSV. 
//   - skipEmptyLines : It will ignore any empty lines in the CSV.
//   - complete : A parse result always contains three objects: data, errors, and meta. 
//     Data and errors are arrays, and meta is an object. In the step callback, the data 
//     array will only contain one element.

// Also, we have passed options, as if user wants to add some more properties to the method 
// or if he want to modify some pre build keys then he can do so.

// Types of Responses

// CSV FILE :
// columnA,columnB,columnC
// "Susan",41,a
// "Mike",5,b
// "Jake",33,c
// "Jill",30,d


// For (header:true) we get
// [{columnA: 'Susan', columnB: '41', columnC: 'a'},
// {columnA: 'Mike', columnB: '5', columnC: 'b'},
// {columnA: 'Jake', columnB: '33', columnC: 'c'},
// {columnA: 'Jill', columnB: '30', columnC: 'd'}]

// // For (header:false) we get
// [['columnA', 'columnB', 'columnC'],
// ['Susan', '41', 'a'],
// ['Mike', '5', 'b'],
// ['Jake', '33', 'c'],
// ['Jill', '30', 'd']]



const parseCsv = async (file: File, options: any) => {
  return new Promise ((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function (results: any) {
        if (results.errors.length) {
          reject(results.error)
        } else {
          resolve(results.data)
        }
      },
      ...options
    });
  })
}

export {showToast, hasError , parseCsv}
