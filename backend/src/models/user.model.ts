import { model, Schema } from "mongoose";

export interface IUser {
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
        },
},{
    timestamps: true
});

export default model<IUser>("User", userSchema);