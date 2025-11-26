import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gift, Shuffle, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RestrictionGrid } from "./RestrictionGrid";
import { motion, AnimatePresence } from "framer-motion";

interface Restriction {
  giver: string;
  restricted: string;
}

interface Assignments {
  [key: string]: string;
}

const SecretSanta: React.FC = () => {
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<Restriction[]>([
    { giver: "", restricted: "" },
  ]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const toggleRestriction = (giver: string, restricted: string) => {
    const exists = restrictions.some(
      (r) => r.giver === giver && r.restricted === restricted
    );

    if (exists) {
      setRestrictions(
        restrictions.filter(
          (r) => !(r.giver === giver && r.restricted === restricted)
        )
      );
    } else {
      setRestrictions([...restrictions, { giver, restricted }]);
    }
  };

  const [newParticipant, setNewParticipant] = useState("");

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    const participantToRemove = newParticipants[index];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    
    // Also remove any restrictions involving this participant
    if (participantToRemove) {
      setRestrictions(restrictions.filter(
        r => r.giver !== participantToRemove && r.restricted !== participantToRemove
      ));
    }
  };



  const startGame = () => {
    const validParticipants = participants.filter((p) => p.trim());
    if (validParticipants.length < 2) {
      setError("Please add at least 2 participants");
      return;
    }

    const restrictionsMap: {
      [key: string]: string[];
    } = {};
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
    setIsShuffling(true);
    
    // Simulate shuffling delay for animation
    setTimeout(() => {
      let attempts = 0;
      const maxAttempts = 100;

      while (attempts < maxAttempts) {
        let success = true;
        const tempAssignments: Assignments = {};
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
          setIsShuffling(false);
          return;
        }

        attempts++;
      }

      setError(
        "Could not find valid assignments. Please try again or adjust restrictions.",
      );
      setIsShuffling(false);
    }, 1500);
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
    setParticipants([]);
    setRestrictions([{ giver: "", restricted: "" }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100/30 to-transparent pt-12 px-4">
      <Card className="w-full max-w-2xl mx-auto bg-neutral-50">
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
                  <div className="flex gap-2">
                    <Input
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addParticipant();
                        }
                      }}
                      placeholder="Enter name and press Enter"
                    />
                    <Button onClick={addParticipant} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <AnimatePresence>
                      {participants.map((participant, index) => (
                        <motion.div
                          key={participant}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                        >
                          <Badge variant="secondary" className="pl-2 pr-1 py-0.5 h-6 text-xs gap-1">
                            {participant}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-3 w-3 hover:bg-destructive/20 hover:text-destructive rounded-full"
                              onClick={() => removeParticipant(index)}
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {participants.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No participants added yet.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                <h3 className="text-sm font-medium">Restrictions</h3>
                {participants.filter(p => p.trim()).length >= 2 ? (
                  <RestrictionGrid
                    participants={participants.filter(p => p.trim())}
                    restrictions={restrictions}
                    onToggleRestriction={toggleRestriction}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Add at least 2 participants to set restrictions.
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={startGame}
                variant="secondary"
                disabled={participants.length < 2}
              >
                Start Secret Santa
              </Button>
            </div>
          ) : Object.keys(assignments).length === 0 ? (
              <div className="space-y-4">
                {isShuffling ? (
                  <div className="text-center py-12 space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Shuffle className="h-12 w-12 mx-auto text-primary" />
                    </motion.div>
                    <p className="text-lg font-medium animate-pulse">Shuffling names...</p>
                  </div>
                ) : (
                  <>
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
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => setSetupComplete(false)}
                        variant="outline"
                      >
                        Back to Setup
                      </Button>
                      <Button
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={shuffleAssignments}
                        variant="secondary"
                      >
                        <Shuffle className="h-4 w-4" />
                        Generate Assignments
                      </Button>
                    </div>
                  </>
                )}
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-center text-lg py-2">
                      {getCurrentParticipant()}, you will be buying a gift for{" "}
                      <span className="font-bold text-green-700 block text-2xl mt-2">
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
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretSanta;
