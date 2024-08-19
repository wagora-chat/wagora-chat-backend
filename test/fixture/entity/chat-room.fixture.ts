export const chatRoomFixture = (name: string, managerId: bigint, ids: bigint[]) => {
    return {
        name: name,
        color: "Red",
        managerId: managerId,
        MemberRoom: {
            create: [
                {
                    memberId: managerId,
                },
                ...ids.map((id) => ({
                    memberId: id,
                })),
            ],
        },
    };
};