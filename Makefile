gen-server-stub:
	${MAKE} -C ./backend gen-server-stub

run-mock-server:
	${MAKE} -C ./backend run-mock-server

run-doc:
	${MAKE} -C ./backend run-doc

gen-client:
	${MAKE} -C ./backend gen-client
	mv -f -v ./backend/out/api/* ./frontend/src/libs/api
