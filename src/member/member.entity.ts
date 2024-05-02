import {
    Member,
} from "@prisma/client";

export class MemberEntity implements Member {
    constructor(private id: bigint,
                private email: string,
                private nickname: string,
                private password: string,
                private profile: string) {
    }
}