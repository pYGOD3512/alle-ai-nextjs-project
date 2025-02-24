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
import ListItemText from "@mui/material/ListItemText";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "next-themes";
import { Book, Code, Video, ChevronDown } from "lucide-react";

const SearchModal = ({ isOpen, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
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
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery !== "") {
      setIsLoading(true);
    }

    const timeout = setTimeout(() => {
      if (trimmedQuery === "") {
        setIsLoading((prev) => (prev !== false ? false : prev));
        setSearchResults((prev) => (prev.length > 0 ? [] : prev));
      } else {
        let mockResults = [];
        if (filter === "all") {
          mockResults = [
            `User Guides: Result for "${searchQuery}"`,
            `API Documentation: Result for "${searchQuery}"`,
            `Tutorials: Result for "${searchQuery}"`,
          ];
        } else if (filter === "user-guides") {
          mockResults = [
            `User Guides: Result 1 for "${searchQuery}"`,
            `User Guides: Result 2 for "${searchQuery}"`,
          ];
        } else if (filter === "api-documentation") {
          mockResults = [
            `API Documentation: Result 1 for "${searchQuery}"`,
            `API Documentation: Result 2 for "${searchQuery}"`,
          ];
        } else if (filter === "tutorials") {
          mockResults = [
            `Tutorials: Result 1 for "${searchQuery}"`,
            `Tutorials: Result 2 for "${searchQuery}"`,
          ];
        }
        setSearchResults(mockResults);
        setIsLoading(false);
      }
    }, 1000);

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
  const hoverBackground = resolvedTheme === "dark" ? "#353535" : "#F5F5F5";
  const selectBackground = resolvedTheme === "dark" ? "#202020" : "#FFFFFF";
  const menuBackground = resolvedTheme === "dark" ? "#202020" : "#FFFFFF";
  const menuItemHoverBackground =
    resolvedTheme === "dark" ? "#353535" : "#F5F5F5";

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
            }}
          />
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: { spinnerColor },
                bottom: "50%",
              }}
            />
          )}
        </Box>

        <Box sx={{ maxHeight: 256, overflowY: "auto" }}>
          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((result, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: `1px solid ${secondaryTextColor}`,
                    "&:hover": { bgcolor: hoverBackground },
                    transition: "background-color 0.2s",
                  }}
                >
                  <ListItemText
                    primary={result}
                    primaryTypographyProps={{ style: { color: textColor } }}
                  />
                </ListItem>
              ))}
            </List>
          ) : searchQuery.trim() !== "" && !isLoading ? (
            <Typography sx={{ color: secondaryTextColor }}>
              No results found.
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default SearchModal;
