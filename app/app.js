const uploadForm = $('#fileUpload');

var droppedFiles = false;

const recognizeImage = function recognizeImage(ocrImage) {

    $('.loading').show();
    return Tesseract.recognize(ocrImage);
};

var ocrResultDebug = null;

const wordInfo = function (word) {
  return word.text + ' HEIGHT: ' + (word.bbox.y1 - word.bbox.y0) + 'px FONT: ' + word.font_name + ' FONT SIZE: ' + word.font_size;
};

const ocrResultHandler = function ocrResultHandler (ocrResult) {

    console.log(ocrResult);

    $('.loading').hide();
    $('.ocrResult').show();
    displayImage(droppedFiles[0]);

    ocrResultDebug = ocrResult;

    ocrResult.words.forEach(function(w) {
        $( "<li>"+wordInfo(w)+"</li>" ).appendTo( "#wordInfo" );
    });
};


function displayImage(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        console.log(event);
        $('#uploadedImage img').attr('src',event.target.result);
    };
    reader.readAsDataURL(file);
}

// From: https://css-tricks.com/drag-and-drop-file-uploading/
uploadForm.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
})
    .on('dragover dragenter', function () {
        uploadForm.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function () {
        uploadForm.removeClass('is-dragover');
    })
    .on('drop', function (e) {
        $('.ocrResult').fadeOut(200);

        if (droppedFiles.length <= 0)
            console.log('UPLOAD AN IMAGE LIKE IS SAYS!');
        else {
            droppedFiles = e.originalEvent.dataTransfer.files;

            recognizeImage(droppedFiles[0]).then(ocrResultHandler);
        }
    });