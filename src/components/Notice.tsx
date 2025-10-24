/**
 * Notice Component
 * 
 * Displays an important warning notice to users about the limitations
 * and proper use of the verification tool. Styled as an alert with
 * warning colors and an icon.
 * 
 * Features:
 * - Warning icon from lucide-react
 * - Amber/yellow color scheme for warnings
 * - Accessible ARIA attributes
 * - Responsive layout
 * 
 * @component
 * @returns {JSX.Element} An important notice alert box
 * 
 * @example
 * <Notice />
 */
import { AlertTriangle } from "lucide-react";

export default function Notice() {
    return (
        <section className="flex justify-center" role="region" aria-labelledby="notice-heading">
            <div className="flex gap-4 items-start p-4 rounded-xl max-w-6xl my-7" style={{ backgroundColor: "#fff7ed", border: "1px solid #fcd34d", color: "#78350f" }} role="alert" aria-labelledby="notice-heading">
                <div className="text-xl" aria-hidden="true"><AlertTriangle /></div>
                <div>
                    <h3 id="notice-heading" className="m-0 mb-1 font-semibold">Important Notice</h3>
                    <p className="m-0">
                        This tool provides verification based on official FDA Philippines and Business Registry databases.
                        Always purchase products from authorized retailers and report suspicious products to the proper authorities.
                    </p>
                </div>
            </div>
        </section>
    )
}


