import { Check } from "lucide-react";
import Modal from "./Modal";
import DetailRow from "./DetailRow";
import type { DisplayProduct } from "../types";

interface ProductCardDetailsModalProps {
    open: boolean;
    onClose: () => void;
    product: DisplayProduct | null;
}

export default function ProductCardDetailsModal({ open, onClose, product }: ProductCardDetailsModalProps) {
    if (!product) return null;

    return (
        <Modal open={open} onClose={onClose} title="Product Details">
            <div>
                <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-verified text-verified">
                        <Check className="w-4 h-4" />
                        <span>VERIFIED</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <span>Compliant</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span>Active</span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-app p-4 bg-app/20 space-y-4">
                <DetailRow label="Category" value={product.category} />
                <DetailRow label="Registration Number" value={product.registrationNo} />
                <DetailRow label="Manufacturer" value={product.manufacturer} />
                <DetailRow label="Registered Date" value={product.registered} />
                <DetailRow label="Expiry Date" value={product.expires} />
            </div>
        </Modal>
    );
}

