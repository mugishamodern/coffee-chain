<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'date', 'payer', 'payee', 'amount', 'method', 'status', 'invoice_id'
    ];
    protected $dates = ['date'];
    public function invoice() { return $this->belongsTo(Invoice::class); }
} 