import { PaddleCheckoutButton } from "./PaddleCheckoutButton";

export function UpgradeCard() {
  return (
    <div className="glass rounded-3xl p-6 text-amber-100 shadow-lg">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-amber-100">Free limit reached</h2>
          <p className="mt-1 text-sm text-amber-100/85">
            You reached the free limit. Upgrade to Pro for unlimited replies.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PaddleCheckoutButton
            className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Upgrade to Pro
          </PaddleCheckoutButton>
          <p className="text-sm text-amber-100/80">
            Still want to try again? Wait until the next month for a fresh quota.
          </p>
        </div>
      </div>
    </div>
  );
}
