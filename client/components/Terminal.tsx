"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useTheme } from "next-themes";

function ForensicTerminalContent({ isDark }: { isDark: boolean }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const currentLineRef = useRef("");

  const handleCommand = (cmd: string, term: Terminal) => {
    const command = cmd.trim().toLowerCase();

    switch (command) {
      case "help":
        term.writeln("Essential Aliases: scan, packets, files, timeline, memory");
        term.writeln("Advanced Syntax: autopsy, wireshark --cli, fls, mactime, vol.py --info");
        term.writeln("System: clear");
        break;

      case "scan":
      case "autopsy":
        term.writeln("[*] Initializing Sleuth Kit engine...");
        term.writeln("[*] Mounting /dev/sda1 as read-only...");
        term.writeln("[+] Partition table: MBR | 3 partitions found");
        term.writeln("[+] File system: NTFS (offset 2048)");
        term.writeln("[!] 4 deleted files recoverable in $Recycle.Bin");
        term.writeln("[+] Scan complete. Open Autopsy GUI for full report.");
        break;

        break;

      case "packets":
      case "wireshark --cli":
        term.writeln("[*] Capturing on eth0 (promiscuous mode)...");
        term.writeln("  Frame 1: 192.168.1.5 -> 8.8.8.8 DNS Query: forensics.gov");
        term.writeln("  Frame 2: 8.8.8.8 -> 192.168.1.5 DNS Response: 142.250.80.46");
        term.writeln("  Frame 3: 192.168.1.5 -> 142.250.80.46 TCP SYN");
        term.writeln("[!] Suspicious outbound connection on port 4444 detected.");
        break;

      case "files":
      case "fls":
      case "fls <image>":
        term.writeln("r/r 5:    $MFT");
        term.writeln("r/r 6:    $MFTMirr");
        term.writeln("d/d 11:   $Orphan");
        term.writeln("r/r 128:  evidence.dd");
        term.writeln("r/r 129:  suspect_chat_logs.txt (deleted)");
        term.writeln("r/r 130:  payload.exe (deleted)");
        break;

      case "timeline":
      case "mactime":
        term.writeln("Mon Jan 13 2025 09:14:22 4096 m... d/d 11 /evidence");
        term.writeln("Mon Jan 13 2025 09:15:01 2048 .a.. r/r 128 /evidence/suspect_chat_logs.txt");
        term.writeln("Mon Jan 13 2025 09:15:44 512 mac. r/r 129 /evidence/payload.exe");
        break;

      case "memory":
      case "vol.py --info":
        term.writeln("[*] Volatility 3 Framework");
        term.writeln("[+] Profile: Win10x64_19041");
        term.writeln("[+] Processes: 87 running | 3 suspicious (cmd.exe, powershell.exe, nc.exe)");
        term.writeln("[!] Network connection: nc.exe -> 185.220.101.47:4444 (ESTABLISHED)");
        term.writeln("[!] Possible reverse shell detected.");
        break;

      case "clear":
        term.clear();
        break;

      case "":
        break;

      default:
        term.writeln(`bash: ${command}: command not found. Type "help" for a list of simplified aliases.`);
    }
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (!terminalRef.current || initialized.current) return;
    initialized.current = true;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      rows: 20,
      cols: 80,
      theme: {
        background: isDark ? "#0f172a" : "#ffffff",
        foreground: isDark ? "#e2e8f0" : "#0f172a",
        cursor: isDark ? "#e2e8f0" : "#0f172a",
        selectionBackground: isDark ? "rgba(226, 232, 240, 0.2)" : "rgba(15, 23, 42, 0.1)",
      },
      fontSize: 14,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    termInstance.current = term;

    let initTimeout: NodeJS.Timeout;
    let pasteListenerAttached = false;

    // Explicitly handle DOM paste event on the terminal's internal textarea
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text");
      if (text && termInstance.current) {
        const sanitized = text.replace(/[\r\n]+/g, "");
        term.write(sanitized);
        currentLineRef.current += sanitized;
      }
    };

    const checkInterval = setInterval(() => {
      // Use a local flag to ensure we only open ONCE per effect mount
      if (terminalRef.current && terminalRef.current.offsetWidth > 0 && !term.element) {
        clearInterval(checkInterval);
        
        try {
          term.open(terminalRef.current);
          
          // Wait for xterm to create its internal textarea and perform initial fit
          initTimeout = setTimeout(() => {
            if (termInstance.current && terminalRef.current && terminalRef.current.offsetParent) {
              try {
                fitAddon.fit();
                termInstance.current.focus();
                
                // Attach paste listener to the internal textarea
                const textarea = terminalRef.current.querySelector(".xterm-helper-textarea");
                if (textarea && !pasteListenerAttached) {
                  textarea.addEventListener("paste", handlePaste as any);
                  pasteListenerAttached = true;
                }

                termInstance.current.writeln("\x1b[1;32m--- FORENSIC_PRO_TERMINAL v1.0.4 ---\x1b[0m");
                termInstance.current.writeln('Type "help" to see available forensic commands.');
                termInstance.current.write("\r\n$ ");
              } catch (e) {}
            }
          }, 200);
        } catch (e) {}
      }
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      if (!termInstance.current || !terminalRef.current || !terminalRef.current.offsetParent) return;
      try {
        fitAddon.fit();
      } catch (e) {}
    });
    resizeObserver.observe(terminalRef.current);

    // Low-level keyboard interceptor to ensure Ctrl+V reaches the paste event
    term.attachCustomKeyEventHandler((e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        return true; 
      }
      return true;
    });

    const dataDisposable = term.onData((data) => {
      if (!termInstance.current || !terminalRef.current || !terminalRef.current.offsetParent) return;

      const char = data;
      if (char === "\r") { // Enter
        term.write("\r\n");
        handleCommand(currentLineRef.current, term);
        currentLineRef.current = "";
        term.write("$ ");
      } else if (char === "\x7f") { // Backspace (DEL)
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (data.length === 1) {
        const code = char.charCodeAt(0);
        if (code >= 32 && code <= 126) {
          currentLineRef.current += char;
          term.write(char);
        }
      }
    });

    return () => {
      clearInterval(checkInterval);
      clearTimeout(initTimeout);
      dataDisposable.dispose();
      resizeObserver.disconnect();
      
      const textarea = terminalRef.current?.querySelector(".xterm-helper-textarea");
      if (textarea) {
        textarea.removeEventListener("paste", handlePaste as any);
      }
      
      const toDispose = termInstance.current;
      termInstance.current = null;
      initialized.current = false;
      
      if (toDispose) {
        try {
          toDispose.dispose();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (termInstance.current) {
      termInstance.current.options.theme = {
        background: isDark ? "#0f172a" : "#ffffff",
        foreground: isDark ? "#e2e8f0" : "#0f172a",
        cursor: isDark ? "#e2e8f0" : "#0f172a",
        selectionBackground: isDark ? "rgba(226, 232, 240, 0.2)" : "rgba(15, 23, 42, 0.1)",
      };
    }
  }, [isDark]);

  return (
    <div 
      className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mt-8 shadow-sm cursor-text"
      onClick={() => {
        if (termInstance.current) {
          termInstance.current.focus();
        }
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-2 border-b border-slate-100 dark:border-slate-800/50 pb-2">
        <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-sm shadow-red-500/20"></div>
        <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20"></div>
        <div className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20"></div>
        <span className="text-[10px] text-emerald-500 font-mono ml-4 uppercase tracking-[0.2em] font-bold">
          TERMINAL_ACTIVE
        </span>
      </div>

      <div 
        ref={terminalRef} 
        className={`h-64 rounded-lg overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0f172a]" : "bg-white"}`} 
      />

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-3 px-1">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Run Scan", cmd: "scan" },
            { label: "Analyze Packets", cmd: "packets" },
            { label: "List Files", cmd: "files" },
            { label: "View Timeline", cmd: "timeline" },
            { label: "Check Memory", cmd: "memory" },
            { label: "Clear", cmd: "clear" },
          ].map((action) => (
            <button
              key={action.cmd}
              onClick={() => {
                if (termInstance.current) {
                  // Manually trigger command for Quick Actions
                  termInstance.current.writeln(action.cmd);
                  handleCommand(action.cmd, termInstance.current);
                  termInstance.current.write("$ ");
                  currentLineRef.current = ""; // Clear any partial manual input
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all active:scale-95"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ForensicTerminal() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 mt-8 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;
  }

  return <ForensicTerminalContent isDark={isDark} />;
}