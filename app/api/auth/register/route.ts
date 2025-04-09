import { NextRequest, NextResponse, userAgent } from "next/server";
import { connectTODatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest){
  try{
    await connectTODatabase();
    const { email, password } = await req.json();
    
    if(!email || !password){
      return NextResponse.json(
        { message: "Please provide email and password" }, 
        { status: 400 });
    }
    await connectTODatabase()

    const existingUser = await User.findOne({email})

    if(existingUser){
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 });
    };
    
    await User.create({ 
      email, 
      password 
    });
    
    return NextResponse.json(
      { message: "User created successfully" }, 
      { status: 201 }
    );
  } catch(error){
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }