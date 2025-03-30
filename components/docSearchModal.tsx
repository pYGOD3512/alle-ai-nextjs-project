import { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "next-themes";
import { Book, Code, Video, ChevronDown } from "lucide-react";
import { apiReference } from "@/lib/constants/docs";

// Interface for search results
interface SearchResult {
  title: string;
  section: string;
  hash: string;
  baseUrl: string;
  matchedKeywords?: string[];
  description?: string;
}

const SearchModal = ({ isOpen, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (trimmedQuery === "") {
      setIsLoading(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      const results: SearchResult[] = [];

      if (filter === "api-documentation" || filter === "all") {
        // Search through API reference sections
        apiReference.forEach((ref) => {
          ref.sections.forEach((section) => {
            let matchedKeywords: string[] = [];

            // Search in keywords
            section.keywords?.forEach((keyword) => {
              keyword.searchTerms.forEach((term) => {
                const matches = term.words.filter((word) =>
                  word.toLowerCase().includes(trimmedQuery)
                );
                matchedKeywords.push(...matches);
              });
            });

            // Search in title
            const matchesTitle = section.title.toLowerCase().includes(trimmedQuery);

            if (matchedKeywords.length > 0 || matchesTitle) {
              const hash =
                section.keywords?.[0]?.searchTerms[0]?.hash || section.id;
              results.push({
                title: section.title,
                section: ref.title,
                hash: hash,
                baseUrl:
                  section.keywords?.[0]?.baseUrl || `/docs/api-reference/${section.href}`,
                matchedKeywords: [...new Set(matchedKeywords)], // Remove duplicates
                description: section.description
              });
            }
          });
        });
      }

      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, filter]);

  const spinnerColor =
    resolvedTheme === "dark"
      ? "rgba(255, 255, 255, 0.7)" // Subtle white for dark mode
      : "rgba(0, 0, 0, 0.6)";

  const filterOptions = [
    { value: "all", label: "All", icon: <Book size={16} /> },
    { value: "user-guides", label: "User Guides", icon: <Book size={16} /> },
    {
      value: "api-documentation",
      label: "API Documentation",
      icon: <Code size={16} />,
    },
    { value: "tutorials", label: "Tutorials", icon: <Video size={16} /> },
  ];

  const modalBackground = resolvedTheme === "dark" ? "#252525" : "#FFFFFF";
  const textColor = resolvedTheme === "dark" ? "#E0E0E0" : "#333333";
  const secondaryTextColor = resolvedTheme === "dark" ? "#A0A0A0" : "#666666";
  const highlightedTextColor = resolvedTheme === "dark" ? "#9CA3AF" : "#6B7280"; // Mid gray for highlights
  const hoverBackground = resolvedTheme === "dark" ? "#353535" : "#F5F5F5";
  const selectBackground = resolvedTheme === "dark" ? "#202020" : "#FFFFFF";
  const menuBackground = resolvedTheme === "dark" ? "#202020" : "#FFFFFF";
  const menuItemHoverBackground =
    resolvedTheme === "dark" ? "#353535" : "#F5F5F5";

  const primaryColor = resolvedTheme === 'dark' ? '#2563eb' : '#3b82f6'; // Blue primary color

  // Helper function to highlight matched text
  const HighlightedText = ({ text, query, isKeyword = false }: { text: string; query: string; isKeyword?: boolean }) => {
    if (!query.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return (
      <>
        {parts.map((part, i) => (
          part.toLowerCase() === query.toLowerCase() ? (
            <Box
              key={i}
              component="span"
              sx={
                isKeyword ? {
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  px: 1,
                  py: 0.25,
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                } : {
                  color: highlightedTextColor,
                  fontWeight: 500
                }
              }
            >
              {part}
            </Box>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </>
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 4,
      }}
    >
      <Box
        sx={{
          width: 640,
          bgcolor: modalBackground,
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ color: textColor }}
        >
          Search Documentation
        </Typography>

        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel id="filter-label" sx={{ color: secondaryTextColor }}>
            Filter
          </InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
            renderValue={(selected) =>
              filterOptions.find((opt) => opt.value === selected)?.label
            }
            IconComponent={() => (
              <ChevronDown size={16} color={secondaryTextColor} />
            )}
            sx={{
              color: textColor,
              bgcolor: selectBackground,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: secondaryTextColor,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: textColor,
              },
              "& .MuiSelect-select": {
                bgcolor: selectBackground,
              },
              "& .MuiPaper-root": {
                bgcolor: menuBackground,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: menuBackground,
                  color: textColor,
                  "& .MuiMenuItem-root": {
                    color: textColor,
                    "&:hover": {
                      bgcolor: menuItemHoverBackground,
                    },
                    "&.Mui-selected": {
                      bgcolor: menuItemHoverBackground,
                      "&:hover": {
                        bgcolor: menuItemHoverBackground,
                      },
                    },
                  },
                },
              },
            }}
          >
            {filterOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  bgcolor: menuBackground,
                  "&:hover": {
                    bgcolor: menuItemHoverBackground,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.icon}
                  <Typography sx={{ color: textColor }}>
                    {option.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ position: "relative", mb: 2 }}>
          <TextField
            inputRef={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            fullWidth
            variant="outlined"
            autoFocus
            sx={{
              "& .MuiInputBase-input": { color: textColor },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: secondaryTextColor,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: textColor,
              },
            }}
            InputProps={{
              sx: { bgcolor: modalBackground },
              endAdornment: isLoading ? (
                <CircularProgress
                  size={20}
                  sx={{
                    color: spinnerColor,
                    mr: 1
                  }}
                />
              ) : null
            }}
          />
        </Box>

        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            mt: 2,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: secondaryTextColor,
              borderRadius: "4px",
            },
          }}
        >
          {searchQuery.trim() !== "" && searchResults.length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                color: secondaryTextColor,
                textAlign: "center",
                py: 4,
              }}
            >
              No results found
            </Typography>
          ) : searchResults.length > 0 ? (
            <List sx={{ py: 0 }}>
              {searchResults.map((result, index) => (
                <ListItem
                  key={index}
                  component="div"
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: hoverBackground,
                    },
                    transition: "background-color 0.2s",
                    py: 1.5, // Reduced padding
                  }}
                  onClick={() => {
                    // TODO: Implement navigation using result.baseUrl and result.hash
                    console.log("Navigate to:", result.baseUrl, "#" + result.hash);
                    onClose();
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    {/* Breadcrumb-style header */}
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: secondaryTextColor,
                        fontSize: "0.75rem",
                        mb: 0.5
                      }}
                    >
                      {result.section} <span style={{ margin: '0 4px' }}>›</span> <HighlightedText text={result.title} query={searchQuery} />
                    </Typography>

                    {/* Description */}
                    {result.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: textColor,
                          fontSize: "0.8rem",
                          mb: 0.5,
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <HighlightedText text={result.description} query={searchQuery} />
                      </Typography>
                    )}

                    {/* Keywords row */}
                    {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                      <Box 
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mt: 0.5
                        }}
                      >
                        {result.matchedKeywords.slice(0, 3).map((keyword, i) => (
                          <Box 
                            key={i} 
                            component="span"
                            sx={{
                              backgroundColor: `${primaryColor}10`,
                              fontSize: '0.75rem', // text-xs
                              color: primaryColor,
                              px: 1,
                              py: 0.25,
                              borderRadius: '9999px', // rounded-full
                            }}
                          >
                            {keyword}
                          </Box>
                        ))}
                        {result.matchedKeywords.length > 3 && (
                          <Box 
                            component="span"
                            sx={{
                              fontSize: '0.75rem',
                              color: secondaryTextColor,
                              alignSelf: 'center'
                            }}
                          >
                            +{result.matchedKeywords.length - 3}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default SearchModal;
