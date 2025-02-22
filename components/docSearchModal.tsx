// components/SearchModal.tsx
import { useState, useEffect, useRef } from "react";
import { Modal, Input, Spin } from "antd";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsLoading(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      const mockResults: string[] = [
        `Result 1 for "${searchQuery}"`,
        `Result 2 for "${searchQuery}"`,
        `Result 3 for "${searchQuery}"`,
      ];
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Search Documentation"
      footer={null}
      width={640}
      style={{ top: '80px' }}
    >
      <div className="relative p-4 rounded-lg">
        <div className="relative">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            size="large"
            autoFocus
          />
          {isLoading && (
            <div className="absolute right-3 top-[50%] -translate-y-[50%] pointer-events-none">
              <Spin className="!text-primary" />
            </div>
          )}
        </div>

        <div className="mt-4 max-h-64 overflow-y-auto">
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="p-2 border-b border-border hover:bg-secondary/50 transition-colors text-foreground"
                >
                  {result}
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() !== "" && !isLoading ? (
            <p className="text-muted-foreground">No results found.</p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
