<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Store extends Model {
    protected $guarded = [];

    public function getUserDetails() {
        return $this->belongsTo(User::class, 'id', 'store_id');
    }
}