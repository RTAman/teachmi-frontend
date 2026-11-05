import { useState } from 'react';
import AppBar from '../components/AppBar/AppBar';
import AppShell from '../components/AppShell/AppShell';
import BottomCTA from '../components/BottomCTA/BottomCTA';
import BottomSheet from '../components/BottomSheet/BottomSheet';
import Button from '../components/Button/Button';
import ButtonRow from '../components/Button/ButtonRow';
import Card from '../components/Card/Card';
import Dialog from '../components/Dialog/Dialog';
import InlineError from '../components/InlineError/InlineError';
import Skeleton from '../components/Skeleton/Skeleton';
import StepBar from '../components/StepBar/StepBar';
import Tag from '../components/Tag/Tag';
import TextField from '../components/TextField/TextField';
import Toast from '../components/Toast/Toast';

const headingStyle = { margin: '0 0 12px', fontSize: 13, fontWeight: 700 };
const stackStyle = { display: 'grid', gap: 10 };

// 공통 컴포넌트를 확인하는 개발용 화면입니다. 실제 서비스 화면이 아닙니다.
export default function ComponentPreview() {
  const [step, setStep] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [number, setNumber] = useState('');

  return (
    <AppShell
      header={
        <>
          <AppBar
            title="컴포넌트 확인"
            onBack={() => setStep((value) => Math.max(1, value - 1))}
            actionLabel="다음 단계"
            onAction={() => setStep((value) => Math.min(5, value + 1))}
          />
          <StepBar current={step} label="단계 이름" />
        </>
      }
      footer={
        <BottomCTA>
          <Button variant="secondary" onClick={() => setToastOpen(true)}>
            토스트 보기
          </Button>
          <Button onClick={() => setDialogOpen(true)}>확인 창 열기</Button>
        </BottomCTA>
      }
    >
      <Card>
        <h2 style={headingStyle}>Button</h2>
        <div style={stackStyle}>
          <ButtonRow>
            <Button size="md">기본 버튼</Button>
            <Button size="md" variant="secondary">
              보조 버튼
            </Button>
          </ButtonRow>
          <Button disabled>비활성 버튼</Button>
        </div>
      </Card>

      <Card>
        <h2 style={headingStyle}>Tag</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Tag tone="ok">ok</Tag>
          <Tag tone="ai">ai</Tag>
          <Tag tone="warn">warn</Tag>
          <Tag tone="bad">bad</Tag>
          <Tag tone="neutral">neutral</Tag>
          <Tag tone="lime">lime</Tag>
        </div>
      </Card>

      <Card>
        <h2 style={headingStyle}>TextField</h2>
        <div style={stackStyle}>
          <TextField
            label="숫자 입력칸"
            required
            unit="단위"
            mono
            inputMode="numeric"
            placeholder="문자를 넣으면 오류가 표시돼요"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            error={number && !/^\d+$/.test(number) ? '숫자만 입력해 주세요.' : undefined}
          />
          <TextField label="여러 줄 입력칸" multiline rows={3} placeholder="입력 예시" />
        </div>
      </Card>

      <Card>
        <h2 style={headingStyle}>Skeleton · InlineError</h2>
        <div style={stackStyle}>
          <Skeleton width="60%" />
          <Skeleton width="35%" height={8} radius={4} />
          <InlineError>오류 문구 예시</InlineError>
        </div>
      </Card>

      <Button variant="secondary" onClick={() => setSheetOpen(true)}>
        바텀시트 열기
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="확인 창 제목"
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button size="md" onClick={() => setDialogOpen(false)}>
              확인
            </Button>
          </>
        }
      >
        확인 창 내용 예시
      </Dialog>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="바텀시트 제목"
        actions={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setSheetOpen(false)}>저장</Button>
          </>
        }
      >
        <TextField label="입력칸" required hint="안내 문구 예시" />
      </BottomSheet>

      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        토스트 문구 예시
      </Toast>
    </AppShell>
  );
}
