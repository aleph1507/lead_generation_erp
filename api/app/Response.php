<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Response
 *
 * @property int $id
 * @property int $message_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Response onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response query()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response whereMessageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Response whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Response withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Response withoutTrashed()
 * @mixin \Eloquent
 */
class Response extends Model
{
    use SoftDeletes;

    protected $fillable = ['text', 'message_id'];

    public function chat()
    {
        return $this->belongsTo('\AppChat');
    }
}
