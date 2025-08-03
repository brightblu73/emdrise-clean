export default function BLSPickerGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 text-white z-50 p-6 flex flex-col justify-center items-center">
      <h2 className="text-2xl mb-4">Choosing a BLS Method</h2>
      <ul className="text-sm space-y-4 max-w-md text-left">
        <li><strong>Visual</strong>: Good if you're comfortable with screens and want to track a ball. Helps people who like visual focus.</li>
        <li><strong>Tapping</strong>: Try this if you're tactile, fidgety, or want to stay grounded in your body. Works well with eyes closed.</li>
        <li><strong>Auditory</strong>: Use headphones. Best if you respond strongly to sound or want to avoid visual/tactile effort.</li>
      </ul>
      <button
        onClick={onClose}
        className="mt-8 border border-white px-4 py-2"
      >
        Got it
      </button>
    </div>
  );
}