//Anthony Rusignuolo, Michael Macari, Jon Lafleur
//Huffman Codes

var prompt = require('prompt-sync')();
var fs = require('fs');


function readIn() {


    /* Step 1: Take text input from a file named "infile.dat" */
    var infile_path = prompt('Enter the path to your "infile.dat" to be loaded or nothing if "infile.dat" is in your current directory: ');
//var outfile_path = prompt('Enter the path to your "outfile.dat" file to be saved or nothing if "outfile.dat" is in your current directory.\n');

    if (infile_path === '')
        infile_path = './infile.dat';

    try {
        var infile = fs.readFileSync(infile_path, "utf8");
        //console.log(infile);
    }
    catch (error) {
        return("The file doesn't exist");
    }

    var frequencies = {};
    var letters = RegExp('[^A-Za-z]');
    for (var i of infile) {
        if (letters.test(i))
            continue;
        if (i in frequencies)
            frequencies[i] += 1;
        else
            frequencies[i] = 1;
    }

    var total_chars = 0;
    for (var key in frequencies) {
        total_chars += frequencies[key];
    }
    for (var key in frequencies) {
        frequencies[key] = (frequencies[key] / total_chars) * 100;
    }
    return(frequencies);
}
/* Step 2: Construct the frequency table according to the input text read from the file:
 * The frequency's must be listed, in order, from largest (at the top) to smallest (at the bottom) */

/* Step 3: Using the Huffman algorithm, construct the optimal prefix binary code for the table
 * The Huffman codes will be sorted in the same manner as the one above i.e. frequency, highest to lowest */

/* Step 4: Produce the output, in the file "outfile.dat", consisting of
 * 1) The frequency table for the source text
 * 2) The Huffman code for each letter and digit in the source code
 * 3) The length of the coded message in terms of the number of bits */


console.log(readIn());
