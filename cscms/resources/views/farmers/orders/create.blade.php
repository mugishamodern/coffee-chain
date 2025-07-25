@extends('farmers.layouts.app')

@section('title', 'Add Order')
@section('page-title', 'Add New Order')
@section('page-subtitle', 'Create a new coffee order')

@section('page-actions')
    <a href="{{ route('farmers.orders.index') }}" class="btn btn-outline">
        <i class="fas fa-arrow-left"></i>
        Back to Orders
    </a>
@endsection

@section('content')
    <div class="form-container">
        <form action="{{ route('farmers.orders.store') }}" method="POST">
            @csrf
            
            @include('farmers.partials.form-field', [
                'name' => 'processor_company_id',
                'label' => 'Processor',
                'type' => 'select',
                'required' => true,
                'options' => ['' => 'Select Processor'] + ($processors ?? collect())->pluck('name', 'company_id')->toArray(),
                'value' => old('processor_company_id')
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'coffee_variety',
                'label' => 'Coffee Variety',
                'type' => 'select',
                'required' => true,
                'options' => [
                    '' => 'Select Coffee Variety',
                    'arabica' => 'Arabica',
                    'robusta' => 'Robusta'
                ]
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'grade',
                'label' => 'Grade',
                'type' => 'select',
                'required' => true,
                'options' => [
                    '' => 'Select Grade',
                    'grade_1' => 'Grade 1',
                    'grade_2' => 'Grade 2',
                    'grade_3' => 'Grade 3',
                    'grade_4' => 'Grade 4',
                    'grade_5' => 'Grade 5'
                ]
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'quantity_kg',
                'label' => 'Quantity (kg)',
                'type' => 'number',
                'value' => old('quantity_kg'),
                'placeholder' => 'Enter order quantity',
                'required' => true,
                'step' => '0.01',
                'min' => '0'
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'unit_price',
                'label' => 'Unit Price (UGX/kg)',
                'type' => 'number',
                'value' => old('unit_price'),
                'placeholder' => 'Enter price per kilogram',
                'required' => true,
                'step' => '0.01',
                'min' => '0'
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'total_amount',
                'label' => 'Total Amount (UGX)',
                'type' => 'number',
                'value' => old('total_amount'),
                'placeholder' => 'Total will be calculated automatically',
                'required' => true,
                'step' => '0.01',
                'min' => '0',
                'readonly' => true
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'expected_delivery_date',
                'label' => 'Expected Delivery Date',
                'type' => 'date',
                'value' => old('expected_delivery_date'),
                'required' => true
            ])
            
            @include('farmers.partials.form-field', [
                'name' => 'order_notes',
                'label' => 'Order Notes',
                'type' => 'textarea',
                'value' => old('order_notes'),
                'placeholder' => 'Add any special requirements or notes for this order',
                'rows' => '4'
            ])
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    Create Order
                </button>
                <a href="{{ route('farmers.orders.index') }}" class="btn btn-outline">
                    <i class="fas fa-times"></i>
                    Cancel
                </a>
            </div>
        </form>
    </div>
@endsection