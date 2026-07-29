import { Icons } from '@/components/shared/icons';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface PosPinPadProps {
  onPinSubmit: (pin: string) => void;
  pinLength?: number;
  isLoading?: boolean;
  error?: string | null;
}

export function PosPinPad({ onPinSubmit, pinLength = 4, isLoading = false, error }: PosPinPadProps) {
  const [pin, setPin] = useState<string>('');

  useEffect(() => {
    if (pin.length === pinLength && !isLoading) {
      onPinSubmit(pin);
      // We don't auto-clear here so the UI can show a loading state
      // The parent should remount or change state when done.
    }
  }, [pin, pinLength, onPinSubmit, isLoading]);

  const handleKeyPress = (num: string) => {
    if (pin.length < pinLength && !isLoading) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isLoading) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const clearPin = () => {
    setPin('');
  };

  const renderDots = () => {
    return Array.from({ length: pinLength }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-6 h-6 rounded-full border-2 transition-all duration-200",
          i < pin.length
            ? "bg-primary border-primary scale-110"
            : "bg-transparent border-border ",
          error && "border-destructive bg-destructive/20"
        )}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-8 bg-popover rounded-2xl shadow-xl border border-border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">
          Enter PIN
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter your {pinLength}-digit POS access code
        </p>
      </div>

      <div className="flex gap-4 mb-8 justify-center">
        {renderDots()}
      </div>

      {error && (
        <div className="text-sm text-destructive font-medium mb-4 text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            disabled={isLoading}
            className="h-16 text-2xl font-semibold rounded-2xl bg-muted hover:bg-muted/80 border-none shadow-sm transition-all active:scale-95"
            onClick={() => handleKeyPress(num.toString())}
          >
            {num}
          </Button>
        ))}
        
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={clearPin}
          className="h-16 text-sm font-semibold rounded-2xl bg-muted hover:bg-muted/80 border-none shadow-sm transition-all active:scale-95 text-muted-foreground"
        >
          CLEAR
        </Button>
        
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="h-16 text-2xl font-semibold rounded-2xl bg-muted hover:bg-muted/80 border-none shadow-sm transition-all active:scale-95"
          onClick={() => handleKeyPress('0')}
        >
          0
        </Button>
        
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleBackspace}
          className="h-16 rounded-2xl bg-muted hover:bg-muted/80 border-none shadow-sm transition-all active:scale-95 text-muted-foreground"
        >
          <Icons.Delete className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
