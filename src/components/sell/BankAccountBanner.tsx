export default function BankAccountBanner() {
  return (
    <div className="flex items-start gap-4 bg-indigo-100 border border-indigo-300 p-4 rounded-md mb-6">
      <div className="text-2xl mt-1">💰</div>
      <div className="flex-1">
        <p className="font-semibold">
          Link your bank account to get paid (it only takes a few minutes!)
        </p>
        <p className="text-sm mt-1">
          You will be able to create draft listings, but must link your bank account to publish or be paid out.
          Jawa uses Stripe's platform to securely link to your bank account.
        </p>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700">
        GET STARTED
      </button>
    </div>
  );
}
