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
  return text
    .replace(/\s+/g, " ")
    .replace(/，/g, ",")
    .split(/[\,\s]+/)
    .map((s) => Number(s))
    .filter((v) => !Number.isNaN(v));
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
    if (bounds === "0..n") { setSt(0); setEn(n); } else { setSt(0); setEn(n - 1); }
    setMid(calcMid(0, bounds === "0..n" ? arr.length : arr.length - 1));
    setStep(0);
    setFoundIndex(null);
    setHistory([]);
    setLoopWarn(null);
    visited.current = new Set();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
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
    if (visited.current.has(key)) { setLoopWarn("⚠️ 같은 상태가 반복되었습니다. 무한 루프 위험!"); setAutorun(false); return; }
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
      setHistory((h) => [...h, { step: step + 1, st, mid: m, en, cmp: "<", note }]);
      setSt(newSt);
    } else if (v > t) {
      const newEn = gtUpdateEn === "mid" ? m : m - 1;
      note = `v > target → en = ${gtUpdateEn}`;
      setHistory((h) => [...h, { step: step + 1, st, mid: m, en, cmp: ">", note }]);
      setEn(newEn);
    } else {
      note = "v == target → return mid";
      setHistory((h) => [...h, { step: step + 1, st, mid: m, en, cmp: "=", note }]);
      setFoundIndex(m);
    }
    setStep((s) => s + 1);
  }

  useEffect(() => {
    if (!autorun) { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } return; }
    timerRef.current = setInterval(() => { stepOnce(); }, clamp(speedMs, 120, 2000));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autorun, speedMs, st, en, mid, step, bounds, terminateToken, ltUpdateSt, gtUpdateEn, arrayText, target]);

  function Box({ i, value }) {
    const isSt = i === st; const isEn = i === en; const isMid = i === mid;
    const inRange = bounds === "0..n" ? i >= st && i < en : i >= st && i <= en;
    const base = "border text-sm w-10 h-10 flex items-center justify-center rounded-md transition-all";
    const shade = inRange ? "bg-muted" : "bg-background";
    const color = isMid ? "ring-2 ring-purple-500" : isSt ? "ring-2 ring-sky-500" : isEn ? "ring-2 ring-amber-500" : "";
    return <div className={`${base} ${shade} ${color}`} title={`idx ${i} / val ${value}`}>{value}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">이분 탐색 16가지 조합 시뮬레이터</h1>
      <p className="text-sm text-muted-foreground">범위·st 갱신·en 갱신·종료 조건 2×2×2×2 = 16가지 조합을 직접 선택해서 결과를 확인하세요.</p>

      <Card>
        <CardHeader><CardTitle>설정</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label>탐색 범위</Label>
              <Select value={bounds} onValueChange={setBounds}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0..n">[0, n)</SelectItem>
                  <SelectItem value="0..n-1">[0, n-1]</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>st 갱신</Label>
              <Select value={ltUpdateSt} onValueChange={setLtUpdateSt}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mid">st = mid</SelectItem>
                  <SelectItem value="mid+1">st = mid+1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>en 갱신</Label>
              <Select value={gtUpdateEn} onValueChange={setGtUpdateEn}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mid">en = mid</SelectItem>
                  <SelectItem value="mid-1">en = mid-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>종료 조건</Label>
              <Select value={terminateToken} onValueChange={setTerminateToken}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="st_ge_en">st ≥ en</SelectItem>
                  <SelectItem value="st_gt_en">st &gt; en</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <Label>배열</Label>
              <Input value={arrayText} onChange={(e)=>setArrayText(e.target.value)} placeholder="1,2,3,5,5,7,9" />
            </div>
            <div>
              <Label>찾을 값</Label>
              <Input type="number" value={target} onChange={(e)=>setTarget(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={stepOnce} disabled={foundIndex !== null}><StepForward className="w-4 h-4 mr-2"/>한 칸 진행</Button>
            <Button variant={autorun?"destructive":"default"} onClick={()=>setAutorun(!autorun)} disabled={foundIndex!==null}>
              {autorun ? (<><Pause className="w-4 h-4 mr-2"/>일시정지</>) : (<><Play className="w-4 h-4 mr-2"/>자동 실행</>)}
            </Button>
            <Button variant="secondary" onClick={resetAll}><RotateCcw className="w-4 h-4 mr-2"/>리셋</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>시각화</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full ring-2 ring-sky-500"/> st</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full ring-2 ring-purple-500"/> mid</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full ring-2 ring-amber-500"/> en</div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex items-end gap-2 min-w-[560px]">
              {arr.map((v,i)=> (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Box i={i} value={v} />
                  <div className="text-xs text-muted-foreground">{i}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 items-center text-xs">
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"/> st = {st}</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> mid = {mid}</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> en = {en}</div>
            <div className="flex-1" />
            <div>step: {step}</div>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-6 text-xs font-medium px-3 py-2 bg-muted"><div>step</div><div>st</div><div>mid</div><div>en</div><div>cmp</div><div>note</div></div>
            <div className="max-h-48 overflow-auto divide-y">
              {history.slice().reverse().map((h,i)=> (
                <div key={i} className="grid grid-cols-6 text-xs px-3 py-2">
                  <div>{h.step}</div><div>{h.st}</div><div>{h.mid}</div><div>{h.en}</div><div>{h.cmp}</div><div className="truncate" title={h.note}>{h.note}</div>
                </div>
              ))}
            </div>
          </div>

          {foundIndex!==null && (
            <div className="pt-2 text-sm">
              결과: {foundIndex>=0 ? `✅ index ${foundIndex}` : "❌ 없음"}
              {loopWarn && <span className="ml-2 text-amber-600">{loopWarn}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
