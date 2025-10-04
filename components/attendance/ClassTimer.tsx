'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, PlayCircle, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ClassTimerProps {
  classSession?: {
    startTime: string;
    endTime: string;
    className: string;
    subject: string;
  };
  onSessionEnd?: () => void;
}

export default function ClassTimer({ classSession, onSessionEnd }: ClassTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  useEffect(() => {
    if (classSession && isActive) {
      const now = new Date();
      const [startHour, startMin] = classSession.startTime.split(':').map(Number);
      const [endHour, endMin] = classSession.endTime.split(':').map(Number);

      const start = new Date(now);
      start.setHours(startHour, startMin, 0, 0);

      const end = new Date(now);
      end.setHours(endHour, endMin, 0, 0);

      const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);

      setTotalDuration(duration);
      setTimeLeft(Math.max(0, remaining));
    }
  }, [classSession, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onSessionEnd?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onSessionEnd]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const handleStartSession = () => {
    setIsActive(true);
  };

  const handleStopSession = () => {
    setIsActive(false);
    onSessionEnd?.();
  };

  if (!classSession) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No active class session</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isActive ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Class Session</span>
          </div>
          {isActive && (
            <span className="text-sm font-normal text-muted-foreground">
              {classSession.startTime} - {classSession.endTime}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-accent/50 rounded-lg">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">{classSession.className}</h3>
          <p className="text-sm text-muted-foreground">{classSession.subject}</p>
        </div>

        {isActive ? (
          <>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary mb-2">{formatTime(timeLeft)}</div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
            </div>

            <Progress value={progressPercentage} className="h-3" />

            <Button
              onClick={handleStopSession}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              End Session & Lock Attendance
            </Button>
          </>
        ) : (
          <Button
            onClick={handleStartSession}
            className="w-full"
            size="lg"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Class Session
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
