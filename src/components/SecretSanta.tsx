import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gift, Shuffle, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Restriction {
  giver: string;
  restricted: string;
}

interface Assignments {
  [key: string]: string;
}

const SecretSanta: React.FC = () => {
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [restrictions, setRestrictions] = useState<Restriction[]>([
    { giver: "", restricted: "" },
  ]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const addRestriction = () => {
    setRestrictions([...restrictions, { giver: "", restricted: "" }]);
  };

  const removeRestriction = (index: number) => {
    const newRestrictions = [...restrictions];
    newRestrictions.splice(index, 1);
    setRestrictions(newRestrictions);
  };

  const updateRestriction = (
    index: number,
    field: keyof Restriction,
    value: string,
  ) => {
    const newRestrictions = [...restrictions];
    newRestrictions[index][field] = value;
    setRestrictions(newRestrictions);
  };

  const startGame = () => {
    const validParticipants = participants.filter((p) => p.trim());
    if (validParticipants.length < 2) {
      setError("Please add at least 2 participants");
      return;
    }

    const restrictionsMap = {};
    restrictions.forEach(({ giver, restricted }) => {
      if (giver && restricted) {
        if (!restrictionsMap[giver]) {
          restrictionsMap[giver] = [];
        }
        restrictionsMap[giver].push(restricted);
      }
    });

    setParticipants(validParticipants);
    setSetupComplete(true);
  };

  const shuffleAssignments = () => {
    const available = [...participants];
    const newAssignments = {};
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let success = true;
      const tempAssignments = {};
      const remainingRecipients = [...participants];

      for (const giver of participants) {
        const validRecipients = remainingRecipients.filter(
          (recipient) =>
            recipient !== giver &&
            !restrictions.some(
              (r) => r.giver === giver && r.restricted === recipient,
            ),
        );

        if (validRecipients.length === 0) {
          success = false;
          break;
        }

        const randomIndex = Math.floor(Math.random() * validRecipients.length);
        const recipient = validRecipients[randomIndex];
        tempAssignments[giver] = recipient;
        remainingRecipients.splice(remainingRecipients.indexOf(recipient), 1);
      }

      if (success) {
        setAssignments(tempAssignments);
        setCurrentRound(0);
        setShowResult(false);
        setError("");
        return;
      }

      attempts++;
    }

    setError(
      "Could not find valid assignments. Please try again or adjust restrictions.",
    );
  };

  const nextRound = () => {
    if (currentRound < participants.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setShowResult(false);
    }
  };

  const getCurrentParticipant = () => participants[currentRound];

  const resetGame = () => {
    setAssignments({});
    setCurrentRound(0);
    setShowResult(false);
    setError("");
    setSetupComplete(false);
    setParticipants([""]);
    setRestrictions([{ giver: "", restricted: "" }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100/30 to-transparent pt-12 px-4">
      <Card className="w-full max-w-md mx-auto bg-neutral-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6" />
            Secret Santa Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!setupComplete ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Participants</h3>
                {participants.map((participant, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={participant}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      placeholder="Enter name"
                    />
                    {participants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addParticipant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Restrictions</h3>
                {restrictions.map((restriction, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={restriction.giver}
                      onChange={(e) =>
                        updateRestriction(index, "giver", e.target.value)
                      }
                      placeholder="Cannot give"
                    />
                    <Input
                      value={restriction.restricted}
                      onChange={(e) =>
                        updateRestriction(index, "restricted", e.target.value)
                      }
                      placeholder="To this person"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRestriction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addRestriction}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Restriction
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={startGame}
                variant="secondary"
              >
                Start Secret Santa
              </Button>
            </div>
          ) : Object.keys(assignments).length === 0 ? (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p>Participants:</p>
                <ul className="list-disc pl-4">
                  {participants.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm space-y-1">
                <p>Restrictions:</p>
                <ul className="list-disc pl-4">
                  {restrictions
                    .filter((r) => r.giver && r.restricted)
                    .map((r, index) => (
                      <li key={index}>
                        {r.giver} cannot gift to: {r.restricted}
                      </li>
                    ))}
                </ul>
              </div>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={shuffleAssignments}
                variant="secondary"
              >
                <Shuffle className="h-4 w-4" />
                Generate Assignments
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium">
                  Round {currentRound + 1} of {participants.length}
                </p>
                <p className="text-sm text-gray-500">
                  It's {getCurrentParticipant()}'s turn
                </p>
              </div>

              {!showResult ? (
                <Button
                  className="w-full"
                  onClick={() => setShowResult(true)}
                  variant="secondary"
                >
                  Reveal My Secret Santa
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription className="text-center">
                      {getCurrentParticipant()}, you will be buying a gift for{" "}
                      <span className="font-bold">
                        {assignments[getCurrentParticipant()]}
                      </span>
                    </AlertDescription>
                  </Alert>

                  {currentRound < participants.length - 1 ? (
                    <Button
                      className="w-full"
                      onClick={nextRound}
                      variant="secondary"
                    >
                      Next Person
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={resetGame}
                      variant="secondary"
                    >
                      Start Over
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretSanta;
