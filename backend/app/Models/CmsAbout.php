<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsAbout extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
