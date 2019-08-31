package main

import (
	"log"
	"os"

	"maxint.co/mediasummon/cmd"
)

func main() {
	if len(os.Args) < 2 {
		log.Println("Invalid command structure. Invoke as: [EXECUTABLE] [COMMAND] -argnames argvals. Received:", os.Args)
		return
	}
	command := os.Args[1]
	os.Args = append(os.Args[:1], os.Args[2:]...)
	switch command {
	case "sync":
		cmd.RunSync()
		break
	case "admin":
		cmd.RunAdmin()
		break
	case "target":
		subcommand := os.Args[1]
		os.Args = append(os.Args[:1], os.Args[2:]...)
		switch subcommand {
		case "add":
			cmd.RunTargetAdd()
			break
		case "remove":
			cmd.RunTargetRemove()
			break
		case "list":
			cmd.RunTargetList()
			break
		default:
			log.Println("Unknown subcommand:", subcommand, "Valid subcommands are: {add, remove, list}")
		}
	default:
		log.Println("Unknown command:", command, "Valid commands are: {sync, admin, target}")
	}
}
