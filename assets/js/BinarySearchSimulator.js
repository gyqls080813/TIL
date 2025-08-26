import React, { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, StepForward, RotateCcw } from "lucide-react";

// =============================
// Helpers
// =============================
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
function parseArray(text) {
  if (!text.trim()) return [];
  return text.replace(/\s+/g, " ").replace(/，/g, ",").split(/[\,\s]+/).map(s => Number(s)).filter(v => !Number.isNaN(v));
}

// =============================
// Main Component
// =============================
export default function BinarySearch16Lab() {
  // Input array and target
  const [arrayText, setArrayText] = useState("1,2,3,5,5,7,9,12,12,13,17");
  const [target, setTarget] = useState(12);

  // 범위 선택 [0,n) vs [0,n-1]
  const [bounds, setBounds] = useState("0..n"); // "0..n" | "0..n-1"

  // st update 규칙: mid | mid+1
  const [ltUpdateSt, setLtUpdateSt] = useState("mid+1");

  // en update 규칙: mid | mid-1
  const [gtUpdateEn, setGtUpdateEn] = useState("mid");

  // 종료 조건: st>=en | st>en
  const [terminateToken, setTerminateToken] = useState("st_ge_en");

  // 실행 관련
  const [speedMs, setSpeedMs] = useState(600);
  const [autorun, setAutorun] = useState(false);
  const arr = useMemo(() => parseArray(arrayText), [arrayText]);
  const t = Number(target);

  // Engine state
  const [st, setSt] = useState(0);
  const [en, setEn] = useState(0);
  const [mid, setMid] = useState(0);
  const [step, setStep] = useState(0);
  const [foundIndex, setFoundIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [loopWarn, setLoopWarn] = useState(null);
  const visited = useRef(new Set());
  const timerRef = useRef(null);
  useEffect(() => {
    resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayText, bounds, terminateToken, ltUpdateSt, gtUpdateEn]);
  function resetAll() {
    const n = arr.length;
    if (bounds === "0..n") {
      setSt(0);
      setEn(n);
    } else {
      setSt(0);
      setEn(n - 1);
    }
    setMid(calcMid(0, bounds === "0..n" ? arr.length : arr.length - 1));
    setStep(0);
    setFoundIndex(null);
    setHistory([]);
    setLoopWarn(null);
    visited.current = new Set();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  const calcMid = (a, b) => Math.floor((a + b) / 2);
  function isTerminated(a, b) {
    if (terminateToken === "st_ge_en") return a >= b;
    if (terminateToken === "st_gt_en") return a > b;
    return false;
  }
  function stepOnce() {
    if (arr.length === 0) return;
    const key = `${st}|${en}`;
    if (visited.current.has(key)) {
      setLoopWarn("⚠️ 같은 상태가 반복되었습니다. 무한 루프 위험!");
      setAutorun(false);
      return;
    }
    visited.current.add(key);
    if (isTerminated(st, en)) {
      setFoundIndex(st < arr.length && arr[st] === t ? st : -1);
      return;
    }
    const m = calcMid(st, en);
    setMid(m);
    const v = arr[m];
    let note = "";
    if (v < t) {
      const newSt = ltUpdateSt === "mid" ? m : m + 1;
      note = `v < target → st = ${ltUpdateSt}`;
      setHistory(h => [...h, {
        step: step + 1,
        st,
        mid: m,
        en,
        cmp: "<",
        note
      }]);
      setSt(newSt);
    } else if (v > t) {
      const newEn = gtUpdateEn === "mid" ? m : m - 1;
      note = `v > target → en = ${gtUpdateEn}`;
      setHistory(h => [...h, {
        step: step + 1,
        st,
        mid: m,
        en,
        cmp: ">",
        note
      }]);
      setEn(newEn);
    } else {
      note = "v == target → return mid";
      setHistory(h => [...h, {
        step: step + 1,
        st,
        mid: m,
        en,
        cmp: "=",
        note
      }]);
      setFoundIndex(m);
    }
    setStep(s => s + 1);
  }
  useEffect(() => {
    if (!autorun) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      stepOnce();
    }, clamp(speedMs, 120, 2000));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autorun, speedMs, st, en, mid, step, bounds, terminateToken, ltUpdateSt, gtUpdateEn, arrayText, target]);
  function Box({
    i,
    value
  }) {
    const isSt = i === st;
    const isEn = i === en;
    const isMid = i === mid;
    const inRange = bounds === "0..n" ? i >= st && i < en : i >= st && i <= en;
    const base = "border text-sm w-10 h-10 flex items-center justify-center rounded-md transition-all";
    const shade = inRange ? "bg-muted" : "bg-background";
    const color = isMid ? "ring-2 ring-purple-500" : isSt ? "ring-2 ring-sky-500" : isEn ? "ring-2 ring-amber-500" : "";
    return /*#__PURE__*/React.createElement("div", {
      className: `${base} ${shade} ${color}`,
      title: `idx ${i} / val ${value}`
    }, value);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mx-auto max-w-6xl p-4 space-y-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold"
  }, "\uC774\uBD84 \uD0D0\uC0C9 16\uAC00\uC9C0 \uC870\uD569 \uC2DC\uBBAC\uB808\uC774\uD130"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "\uBC94\uC704\xB7st \uAC31\uC2E0\xB7en \uAC31\uC2E0\xB7\uC885\uB8CC \uC870\uAC74 2\xD72\xD72\xD72 = 16\uAC00\uC9C0 \uC870\uD569\uC744 \uC9C1\uC811 \uC120\uD0DD\uD574\uC11C \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC138\uC694."), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "\uC124\uC815")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "\uD0D0\uC0C9 \uBC94\uC704"), /*#__PURE__*/React.createElement(Select, {
    value: bounds,
    onValueChange: setBounds
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "0..n"
  }, "[0, n)"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "0..n-1"
  }, "[0, n-1]")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "st \uAC31\uC2E0"), /*#__PURE__*/React.createElement(Select, {
    value: ltUpdateSt,
    onValueChange: setLtUpdateSt
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "mid"
  }, "st = mid"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "mid+1"
  }, "st = mid+1")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "en \uAC31\uC2E0"), /*#__PURE__*/React.createElement(Select, {
    value: gtUpdateEn,
    onValueChange: setGtUpdateEn
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "mid"
  }, "en = mid"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "mid-1"
  }, "en = mid-1")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "\uC885\uB8CC \uC870\uAC74"), /*#__PURE__*/React.createElement(Select, {
    value: terminateToken,
    onValueChange: setTerminateToken
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "st_ge_en"
  }, "st \u2265 en"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "st_gt_en"
  }, "st > en"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "\uBC30\uC5F4"), /*#__PURE__*/React.createElement(Input, {
    value: arrayText,
    onChange: e => setArrayText(e.target.value),
    placeholder: "1,2,3,5,5,7,9"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "\uCC3E\uC744 \uAC12"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: target,
    onChange: e => setTarget(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 pt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: stepOnce,
    disabled: foundIndex !== null
  }, /*#__PURE__*/React.createElement(StepForward, {
    className: "w-4 h-4 mr-2"
  }), "\uD55C \uCE78 \uC9C4\uD589"), /*#__PURE__*/React.createElement(Button, {
    variant: autorun ? "destructive" : "default",
    onClick: () => setAutorun(!autorun),
    disabled: foundIndex !== null
  }, autorun ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Pause, {
    className: "w-4 h-4 mr-2"
  }), "\uC77C\uC2DC\uC815\uC9C0") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Play, {
    className: "w-4 h-4 mr-2"
  }), "\uC790\uB3D9 \uC2E4\uD589")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: resetAll
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    className: "w-4 h-4 mr-2"
  }), "\uB9AC\uC14B")))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "\uC2DC\uAC01\uD654")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-4 text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-3 rounded-full ring-2 ring-sky-500"
  }), " st"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-3 rounded-full ring-2 ring-purple-500"
  }), " mid"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-3 rounded-full ring-2 ring-amber-500"
  }), " en")), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-2 min-w-[560px]"
  }, arr.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex flex-col items-center gap-1"
  }, /*#__PURE__*/React.createElement(Box, {
    i: i,
    value: v
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted-foreground"
  }, i))))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 items-center text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-sky-500"
  }), " st = ", st), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-purple-500"
  }), " mid = ", mid), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-amber-500"
  }), " en = ", en), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }), /*#__PURE__*/React.createElement("div", null, "step: ", step)), /*#__PURE__*/React.createElement("div", {
    className: "border rounded-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-6 text-xs font-medium px-3 py-2 bg-muted"
  }, /*#__PURE__*/React.createElement("div", null, "step"), /*#__PURE__*/React.createElement("div", null, "st"), /*#__PURE__*/React.createElement("div", null, "mid"), /*#__PURE__*/React.createElement("div", null, "en"), /*#__PURE__*/React.createElement("div", null, "cmp"), /*#__PURE__*/React.createElement("div", null, "note")), /*#__PURE__*/React.createElement("div", {
    className: "max-h-48 overflow-auto divide-y"
  }, history.slice().reverse().map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "grid grid-cols-6 text-xs px-3 py-2"
  }, /*#__PURE__*/React.createElement("div", null, h.step), /*#__PURE__*/React.createElement("div", null, h.st), /*#__PURE__*/React.createElement("div", null, h.mid), /*#__PURE__*/React.createElement("div", null, h.en), /*#__PURE__*/React.createElement("div", null, h.cmp), /*#__PURE__*/React.createElement("div", {
    className: "truncate",
    title: h.note
  }, h.note))))), foundIndex !== null && /*#__PURE__*/React.createElement("div", {
    className: "pt-2 text-sm"
  }, "\uACB0\uACFC: ", foundIndex >= 0 ? `✅ index ${foundIndex}` : "❌ 없음", loopWarn && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-amber-600"
  }, loopWarn)))));
}