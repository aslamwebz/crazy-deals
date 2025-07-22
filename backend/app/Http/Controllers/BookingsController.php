<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => []
        ]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'data' => []
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => []
        ]);
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'data' => []
        ]);
    }

    public function destroy($id)
    {
        return response()->json([
            'data' => []
        ]);
    }
    
}
