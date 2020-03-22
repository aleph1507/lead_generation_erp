<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Lead
 *
 * @property int $id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Lead onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead query()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Lead whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Lead withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Lead withoutTrashed()
 * @mixin \Eloquent
 */
class Lead extends Model
{
    protected $fillable = ['email', 'status', 'myNotes', 'myTags',
        'industry', 'location', 'twitter', 'IM', 'phone', 'personalWebsite',
        'companyWebsite', 'companyProfile', 'company', 'from', 'title',
        'summary', 'lastName', 'middleName', 'firstName', 'degree', 'picture',
        'profile', 'visitTime', 'duxid'];

    use SoftDeletes;

    public function clients()
    {
        return $this->belongsToMany('\App\Client');
    }

    public function chats()
    {
        return $this->hasMany('\App\Chat');
    }
}
