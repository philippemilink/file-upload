<?php

function decode_chunk($data) {
    $data = explode(';base64,', $data);

    if (!is_array($data) || !isset($data[1])) {
        return false;
    }

    $data = base64_decode($data[1]);
    if (!$data) {
        return false;
    }

    return $data;
}

$file_path = 'uploads/' . $_POST['file'];
$file_data = decode_chunk($_POST['file_data']);

if (false === $file_data) {
    echo "error";
}

file_put_contents($file_path, $file_data, FILE_APPEND);

echo json_encode([]);