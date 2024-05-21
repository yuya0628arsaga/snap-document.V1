<?php

namespace App\Models;

use App\Traits\Common\SerializeDate;
use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chat extends Model
{
    use HasFactory;
    use HasUlids;
    use SerializeDate;
    use SoftDeletes;
    use SoftCascadeTrait;

    protected array $softCascade = [
        'pages',
    ];

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'immutable_datetime',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
        'deleted_at' => 'immutable_datetime',
    ];

    /**
     *  documentsテーブルとのリレーション
     *
     * @return HasOne
     */
    public function document(): HasOne
    {
        return $this->hasOne(Document::class);
    }

    /**
     * pagesテーブルとのリレーション
     *
     * @return hasMany
     */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    /**
     * chatImagesテーブルとのリレーション
     *
     * @return hasMany
     */
    public function chat_images(): HasMany
    {
        return $this->hasMany(ChatImage::class);
    }

    // /**
    //  * usersテーブルとのリレーション
    //  *
    //  * @return BelongsTo
    //  */
    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }
}
