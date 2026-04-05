#!/usr/bin/env python3
"""
Create ASCII block art for PAPYRUS CLI
"""

def create_block_letter(char):
    """Create block representation of a letter"""
    
    large_font = {
        'P': [
            "███████",
            "██   ██",
            "██   ██",
            "███████",
            "██     ",
            "██     ",
            "██     ",
        ],
        'A': [
            " █████ ",
            "██   ██",
            "██   ██",
            "███████",
            "██   ██",
            "██   ██",
            "██   ██",
        ],
        'Y': [
            "██   ██",
            "██   ██",
            "██   ██",
            " █████ ",
            "   ██  ",
            "   ██  ",
            "   ██  ",
        ],
        'R': [
            "███████",
            "██   ██",
            "██   ██",
            "███████",
            "██ ██  ",
            "██  ██ ",
            "██   ██",
        ],
        'U': [
            "██   ██",
            "██   ██",
            "██   ██",
            "██   ██",
            "██   ██",
            "██   ██",
            " █████ ",
        ],
        'S': [
            " ██████",
            "██     ",
            "██     ",
            " █████ ",
            "     ██",
            "     ██",
            "██████ ",
        ],
        'C': [
            " ██████",
            "██     ",
            "██     ",
            "██     ",
            "██     ",
            "██     ",
            " ██████",
        ],
        'L': [
            "██     ",
            "██     ",
            "██     ",
            "██     ",
            "██     ",
            "██     ",
            "███████",
        ],
        'I': [
            "███████",
            "  ███  ",
            "  ███  ",
            "  ███  ",
            "  ███  ",
            "  ███  ",
            "███████",
        ],
        ' ': [
            "       ",
            "       ",
            "       ",
            "       ",
            "       ",
            "       ",
            "       ",
        ],
    }
    
    return large_font.get(char.upper(), large_font[' '])


def combine_letters(text, spacing=1):
    """Combine multiple letters horizontally"""
    letters = [create_block_letter(c) for c in text]
    height = len(letters[0]) if letters else 7
    
    lines = []
    for row in range(height):
        line_parts = []
        for letter in letters:
            line_parts.append(letter[row])
        line = (" " * spacing).join(line_parts)
        lines.append(line)
    
    return lines


def add_border(lines, border_char="█", padding=2):
    """Add decorative border around text"""
    width = max(len(line) for line in lines) if lines else 0
    
    result = [border_char * (width + 2 * padding + 2)]
    
    for _ in range(padding):
        result.append(border_char + " " * (width + 2 * padding) + border_char)
    
    for line in lines:
        padded = line.center(width)
        result.append(border_char + " " * padding + padded + " " * padding + border_char)
    
    for _ in range(padding):
        result.append(border_char + " " * (width + 2 * padding) + border_char)
    
    result.append(border_char * (width + 2 * padding + 2))
    
    return result


def add_noise(lines, noise_chars=["·", "∙", "•", ""], density=0.05):
    """Add subtle noise/texture to background"""
    import random
    
    result = []
    for line in lines:
        new_line = []
        for char in line:
            if char == " " and random.random() < density:
                new_line.append(random.choice(noise_chars[:-1]))
            else:
                new_line.append(char)
        result.append("".join(new_line))
    
    return result


def create_papyrus_cli_art():
    """Create the full PAPYRUS CLI ASCII art"""
    # Create PAPYRUS line (compact spacing like original)
    line1 = combine_letters("PAPYRUS", spacing=1)
    
    # Create CLI line (compact spacing)
    line2 = combine_letters("CLI", spacing=2)
    
    # Calculate widths
    line1_width = max(len(l) for l in line1)
    line2_width = max(len(l) for l in line2)
    
    # Center line2 under line1
    if line2_width < line1_width:
        padding = (line1_width - line2_width) // 2
        line2 = [" " * padding + l + " " * padding for l in line2]
    
    # Combine both lines with small gap
    combined = line1 + [""] * 2 + line2
    
    # Add shadow effect (original style)
    shadowed = []
    for i, line in enumerate(combined):
        shadow_line = line.replace("█", "▓")
        shadowed.append(shadow_line)
    
    # Add border
    bordered = add_border(shadowed, border_char="█", padding=2)
    
    # Add subtle noise
    final = add_noise(bordered, density=0.05)
    
    return final


def create_terminal_display():
    """Create terminal-style display with the art"""
    art_lines = create_papyrus_cli_art()
    
    term_width = max(len(line) for line in art_lines) + 4
    
    header = "╔" + "═" * (term_width - 2) + "╗"
    title_line = "║" + " PAPYRUS CLI ".center(term_width - 2) + "║"
    sep = "╠" + "═" * (term_width - 2) + "╣"
    empty = "║" + " " * (term_width - 2) + "║"
    footer = "╚" + "═" * (term_width - 2) + "╝"
    
    result = [
        header,
        title_line,
        sep,
        empty,
    ]
    
    for line in art_lines:
        centered = line.center(term_width - 2)
        result.append("║" + centered + "║")
    
    result.extend([
        empty,
        footer,
    ])
    
    return result


def save_as_txt(lines, filename):
    """Save as text file"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Saved text version: {filename}")


def save_as_html(lines, filename):
    """Save as HTML for better viewing"""
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PAPYRUS CLI</title>
    <style>
        body {
            background-color: #1a1a2e;
            color: #e0e0e0;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .terminal {
            background-color: #0f0f1a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(100, 100, 150, 0.3);
        }
        .art {
            white-space: pre;
            line-height: 1.2;
            font-size: 14px;
        }
        .title {
            text-align: center;
            color: #c0c0d0;
            margin-bottom: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="terminal">
        <div class="title">PAPYRUS CLI v1.0.1</div>
        <pre class="art">"""
    
    html += '\n'.join(lines)
    
    html += """</pre>
    </div>
</body>
</html>"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Saved HTML version: {filename}")


def main():
    # Create art
    art_lines = create_terminal_display()
    
    # Print to console
    print("\n" + "="*60)
    print("Generated PAPYRUS CLI ASCII Art:")
    print("="*60 + "\n")
    for line in art_lines:
        print(line)
    print("\n" + "="*60)
    
    # Save versions
    save_as_txt(art_lines, "PAPYRUS_CLI_art.txt")
    save_as_html(art_lines, "PAPYRUS_CLI_art.html")


if __name__ == "__main__":
    main()
