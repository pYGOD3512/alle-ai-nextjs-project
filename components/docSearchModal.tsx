import { useState, useEffect, useRef } from "react";
import { Modal, Input, Spin, InputRef } from "antd";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    // Set loading immediately when query changes
    if (trimmedQuery !== "") {
      setIsLoading(true);
    }

    const timeout = setTimeout(() => {
      if (trimmedQuery === "") {
        setIsLoading((prev) => (prev !== false ? false : prev));
        setSearchResults((prev) => (prev.length > 0 ? [] : prev));
      } else {
        const mockResults: string[] = [
          `Result 1 for "${searchQuery}"`,
          `Result 2 for "${searchQuery}"`,
          `Result 3 for "${searchQuery}"`,
        ];
        setSearchResults(mockResults);
        setIsLoading(false);
      }
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
      style={{ top: "80px" }}
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
