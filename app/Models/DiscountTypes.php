<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountTypes extends Model {
    protected $guarded = [];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}
