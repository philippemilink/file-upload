$(function() {

    var reader = {};
    var file = {};
    var slice_size = 1000 * 1024;

    function start_upload(event) {
        event.preventDefault();

        reader = new FileReader();
        file = document.querySelector('#file-input').files[0];

        upload_file(0);
    }

    $('#submit-button').on('click', start_upload);

    function upload_file(start) {
        var next_slice = start + slice_size + 1;
        var blob = file.slice(start, next_slice);

        reader.onloadend = function (event) {
            if (event.target.readyState !== FileReader.DONE) {
                return;
            }

            $.ajax({
                url: "upload.php",
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    file_data: event.target.result,
                    file: file.name
                    // file_type: file.type
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                },
                success: function(data) {
                    var size_done = start + slice_size;
                    var percent_done = Math.floor((size_done / file.size) * 100);

                    if (next_slice < file.size) {
                        // Update upload progress
                        $( '#upload-progress' ).html( 'Uploading File - ' + percent_done + '%' );

                        // More to upload, call function recursively
                        upload_file(next_slice);
                    } else {
                        // Update upload progress
                        $('#upload-progress').html('Upload Complete!');
                    }
                }
            } );
        };

        reader.readAsDataURL(blob);
    }

});