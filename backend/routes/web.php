<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/assets/{path}', function (Request $request) {
    $file = base_path('../frontend/dist/assets/' . $request->path);
    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $mime = match ($ext) {
            'js' => 'application/javascript',
            'css' => 'text/css',
            default => 'application/octet-stream',
        };
        return response()->file($file, ['Content-Type' => $mime]);
    }
    abort(404);
})->where('path', '.*');

Route::get('/favicon.svg', function () {
    return response()->file(base_path('../frontend/dist/favicon.svg'));
});

Route::get('/icons.svg', function () {
    return response()->file(base_path('../frontend/dist/icons.svg'));
});

Route::get('/logo.png', function () {
    return response()->file(base_path('../frontend/dist/logo.png'));
});

Route::get('/{any?}', function () {
    $indexFile = base_path('../frontend/dist/index.html');
    if (!file_exists($indexFile)) {
        return response()->json([
            'message' => __('messages.frontend_not_built'),
        ]);
    }
    return response()->file($indexFile, ['Content-Type' => 'text/html']);
})->where('any', '.*');
