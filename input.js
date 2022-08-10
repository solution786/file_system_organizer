#!/usr/bin/env node
// shabang syntax


// command line arguments
// at index 0 -> node
// at index 1 -> filename
// example -> node input.js

let fs = require("fs");
const path = require("path");
// to take input from command line
let inputArr = process.argv.slice(2);
console.log(inputArr);

// -----------------------------------
// we will learn tree, organize, help

// ***************************************

let command = inputArr[0];
switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;

  case "organize":
    organizeFn(inputArr[1]);
    break;

  case "help":
    helpFn();
    break;

  default:
    console.log("Please input right command");
}

function treeFn(dirPath) {
  //   console.log("Tree command implemented for ", dirPath);

//   let destinationPath;
  // console.log("organize command implemented for ", dirPath);
  // 1. input -> directory path given
  if (dirPath == undefined) {
    // console.log("kindly enter the path");
    process.cwd(); 
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
        treeHelper(process.cwd(), "");
    } else {
      console.log("kindly enter the correct path");
      return;
    }
  }
}

function treeHelper(dirPath, indent){
    // isFile or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + "|---"  + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent + "*-----" + dirName);
        let children = fs.readdirSync(dirPath);
        for(let i = 0; i < children.length; i++){
            let childPath = path.join(dirPath, children[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}

function organizeFn(dirPath) {
  let destinationPath;
  // console.log("organize command implemented for ", dirPath);
  // 1. input -> directory path given
  if (dirPath == undefined) {
    // console.log("kindly enter the path");
    destinationPath = process.cwd();
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      // 2. create -> organized_files directory
      destinationPath = path.join(dirPath, "organized_files");
      if (fs.existsSync(destinationPath) == false) {
        fs.mkdirSync(destinationPath);
      }
    } else {
      console.log("kindly enter the correct path");
      return;
    }

    organizeHelper(dirPath, destinationPath);
  }
}
function organizeHelper(src, dest) {
  // 3. identify categories of all the files present in that input directory
  let childNames = fs.readdirSync(src);
  // console.log(childNames);
  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      // console.log(childNames[i]);
      // 4. copy/cut files to that organized directory inside of any of category folder
      let category = getCategory(childNames[i]);
      sendFiles(childAddress, dest, category);
    }
  }
}

function sendFiles(scrFilePath, dest, category) {
  let categoryPath = path.join(dest, category);
  if (fs.existsSync(categoryPath) == false) {
    fs.mkdirSync(categoryPath);
  }
  let fileName = path.basename(scrFilePath);
  let destFilePath = path.join(categoryPath, fileName);
  fs.copyFileSync(scrFilePath, destFilePath);
}

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1); // to remove .
  for (let type in types) {
    let currTypeArray = types[type];
    for (let i = 0; i < currTypeArray.length; i++) {
      if (ext == currTypeArray[i]) {
        return type;
      }
    }
  }

  return "others";
}

// help implemented
function helpFn() {
  console.log("Help command implemented");
}
