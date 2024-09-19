import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema ({ 
    code: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return `ticket- ${Math.random().toString()}`;
        }
    },
    purchase_datetime:{
        type: Date,
        default: Date.now,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        required: true
    }
})

const TicketModel = mongoose.model("tickets", ticketSchema);

export default TicketModel;