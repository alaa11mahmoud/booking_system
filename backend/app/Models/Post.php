<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'price',
        'max_members',
        'start_date',
        'end_date',
        'image_url',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime:Y-m-d\TH:i',
            'end_date' => 'datetime:Y-m-d\TH:i',
            'price' => 'decimal:2',
            'max_members' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(PostSubscription::class);
    }

    public function hasEnded(): bool
    {
        return $this->end_date && now()->greaterThan($this->end_date);
    }

    public function availableSpots(): ?int
    {
        if (!$this->max_members) {
            return null;
        }

        $count = $this->relationLoaded('subscriptions')
            ? $this->subscriptions->count()
            : $this->subscriptions_count ?? $this->subscriptions()->count();

        return $this->max_members - $count;
    }
}
